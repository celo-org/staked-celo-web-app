import { useCelo } from '@celo/react-celo';
import { useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import api from 'src/services/api';
import { PendingWithdrawal } from 'src/types/account';
import { CeloWei } from 'src/types/units';

const botActionDelay = 120 * 1000;

export const useWithdrawalBot = (address: string | null) => {
  const { managerContract, accountContract } = useContracts();

  const finalizeWithdrawal = useCallback(async () => {
    if (!address) return;
    const [activeGroups, deprecatedGroups] = await Promise.all([
      managerContract.methods.getGroups().call(),
      managerContract.methods.getDeprecatedGroups().call(),
    ]);
    const groups = [...activeGroups, ...deprecatedGroups];
    for (const group of groups) {
      const scheduledWithdrawals = await accountContract.methods
        .scheduledWithdrawalsForGroupAndBeneficiary(group, address)
        .call();
      if (scheduledWithdrawals !== '0') return api.withdraw(address);
    }
  }, [address, managerContract, accountContract]);

  useEffect(() => {
    const intervalId = setInterval(finalizeWithdrawal, botActionDelay);
    return () => {
      clearInterval(intervalId);
    };
  }, [finalizeWithdrawal]);
};

export const useClaimingBot = (address: string | null) => {
  const { kit } = useCelo();
  const { accountContract } = useContracts();

  const claim = useCallback(async () => {
    if (!address) return;
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
  }, [address, accountContract, kit.connection]);

  useEffect(() => {
    const intervalId = setInterval(claim, botActionDelay);
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
        amount: new CeloWei(amount),
        timestamp,
      });
      continue;
    }

    /* If next timestamp is within allowed time span merge it with the last pending withdrawal */
    const lastPendingWithdrawal = pendingWithdrawals[pendingWithdrawals.length - 1];
    lastPendingWithdrawal.timestamp = timestamp;
    lastPendingWithdrawal.amount = new CeloWei(lastPendingWithdrawal.amount.plus(amount).toFixed());
  }

  return pendingWithdrawals;
};

export const useWithdrawals = (address: string | null) => {
  const { accountContract } = useContracts();

  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);
  const loadPendingWithdrawals = useCallback(async () => {
    const { values = [], timestamps = [] } = await accountContract.methods
      .getPendingWithdrawals(address)
      .call();
    setPendingWithdrawals(formatPendingWithdrawals(values, timestamps));
  }, [accountContract, address]);

  useEffect(() => {
    if (!address) return;
    void loadPendingWithdrawals();
    const intervalId = setInterval(loadPendingWithdrawals, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [loadPendingWithdrawals, address]);

  return {
    pendingWithdrawals,
    loadPendingWithdrawals,
  };
};
