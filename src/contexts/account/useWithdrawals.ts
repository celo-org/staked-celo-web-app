import { useCelo } from '@celo/react-celo';
import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useAPI } from 'src/hooks/useAPI';
import { Celo } from 'src/utils/tokens';

export interface PendingWithdrawal {
  amount: Celo;
  timestamp: string;
}

const botActionInterval = 180 * 1000;

export const useWithdrawalBot = (address: string | null) => {
  // const { api } = useAPI();
  // const { managerContract, accountContract } = useBlockchain();
  // const finalizeWithdrawal = useCallback(async () => {
  //   if (!address || !managerContract || !accountContract) return;
  //   const [activeGroups, deprecatedGroups] = await Promise.all([
  //     // TODO find replacement as this is removed from v2
  //     managerContract.methods.getGroups().call(),
  //     managerContract.methods.getDeprecatedGroups().call(),
  //   ]);
  //   const groups = [...activeGroups, ...deprecatedGroups];
  //   for (const group of groups) {
  //     const scheduledWithdrawals = await accountContract.methods
  //       .scheduledWithdrawalsForGroupAndBeneficiary(group, address)
  //       .call();
  //     if (scheduledWithdrawals !== '0') return api.withdraw(address);
  //   }
  // }, [address, managerContract, accountContract, api]);
  // useEffect(() => {
  //   void finalizeWithdrawal();
  //   const intervalId = setInterval(finalizeWithdrawal, botActionInterval);
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [finalizeWithdrawal]);
};

export const useClaimingBot = (address: string | null) => {
  const { kit } = useCelo();
  const { api } = useAPI();
  const { accountContract } = useBlockchain();

  const claim = useCallback(async () => {
    if (!address || !accountContract) return;
    const { eth } = kit.connection.web3;

    const [{ timestamp: currentBlockTimestamp }, { timestamps: withdrawalTimestamps }] =
      await Promise.all([
        eth.getBlock('latest'),
        accountContract.methods.getPendingWithdrawals(address).call(),
      ]);

    const availableToClaim = !!(withdrawalTimestamps as string[]).find(
      (withdrawalTimestamp) => withdrawalTimestamp < currentBlockTimestamp
    );

    if (availableToClaim) await api.claim(address);
  }, [address, accountContract, kit.connection, api]);

  useEffect(() => {
    void claim();
    const intervalId = setInterval(claim, botActionInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, [claim]);
};

/**
 * Groups pending withdrawals that are within 5 minutes time span
 */
const groupingTimeSpan: number = 5 * 60;
const formatPendingWithdrawals = (values: string[], timestamps: string[]): PendingWithdrawal[] => {
  const sortedTimestamps = [...timestamps].sort();
  const pendingWithdrawals: PendingWithdrawal[] = [];

  let referenceTimestamp = 0;
  for (const index in sortedTimestamps) {
    const timestamp = sortedTimestamps[index];
    const amount = values[index];

    /* If next timestamp is not within allowed time span create new pending withdrawal */
    if (parseInt(timestamp) > referenceTimestamp + groupingTimeSpan) {
      referenceTimestamp = parseInt(timestamp);
      pendingWithdrawals.push({
        amount: new Celo(amount),
        timestamp,
      });
      continue;
    }

    /* If next timestamp is within allowed time span merge it with the last pending withdrawal */
    const lastPendingWithdrawal = pendingWithdrawals[pendingWithdrawals.length - 1];
    lastPendingWithdrawal.timestamp = timestamp;
    lastPendingWithdrawal.amount = new Celo(lastPendingWithdrawal.amount.plus(amount));
  }

  return pendingWithdrawals.reverse();
};

const pendingWithdrawalsLoadInterval = 60 * 1000;

export const useWithdrawals = (address: string | null) => {
  const { accountContract } = useBlockchain();

  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);
  const loadPendingWithdrawals = useCallback(async () => {
    if (!address || !accountContract) {
      return;
    }
    const { values = [], timestamps = [] } = await accountContract.methods
      .getPendingWithdrawals(address)
      .call();
    setPendingWithdrawals(formatPendingWithdrawals(values, timestamps));
  }, [accountContract, address]);

  useEffect(() => {
    if (!address) return;
    void loadPendingWithdrawals();
    const intervalId = setInterval(loadPendingWithdrawals, pendingWithdrawalsLoadInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, [loadPendingWithdrawals, address]);

  return {
    pendingWithdrawals,
    loadPendingWithdrawals,
  };
};
