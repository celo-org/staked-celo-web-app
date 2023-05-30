import { useCallback, useEffect } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useAPI } from 'src/hooks/useAPI';
import { Celo } from 'src/utils/tokens';
import { useContractRead, usePublicClient } from 'wagmi';

export interface PendingWithdrawal {
  amount: Celo;
  timestamp: string;
}

const botActionInterval = 180 * 1000;

export const useWithdrawalBot = (/*address: string | undefined*/) => {
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

export const useClaimingBot = (address: `0x${string}` | undefined) => {
  const { api } = useAPI();
  const { accountContract } = useBlockchain();
  const publicClient = usePublicClient();
  const { refetch: loadPendingWithdrawals } = useContractRead({
    ...accountContract,
    functionName: 'getPendingWithdrawals',
    args: [address!],
    enabled: !!address,
  });

  const claim = useCallback(async () => {
    if (!address) return;

    const [{ timestamp: currentBlockTimestamp }, { data: valuesAndTimestamps }] = await Promise.all(
      [publicClient.getBlock({ blockTag: 'latest' }), loadPendingWithdrawals()]
    );
    const [, withdrawalTimestamps] = valuesAndTimestamps!;
    const availableToClaim = !!withdrawalTimestamps.find(
      (withdrawalTimestamp) => withdrawalTimestamp < currentBlockTimestamp
    );

    if (availableToClaim) await api.claim(address);
  }, [address, loadPendingWithdrawals, publicClient, api]);

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
const groupingTimeSpan = 5n * 60n;
const formatPendingWithdrawals = (values: bigint[], timestamps: bigint[]): PendingWithdrawal[] => {
  const sortedTimestamps = [...timestamps].sort();
  const pendingWithdrawals: PendingWithdrawal[] = [];

  let referenceTimestamp = 0n;
  for (const index in sortedTimestamps) {
    const timestamp = sortedTimestamps[index];
    const amount = values[index];

    /* If next timestamp is not within allowed time span create new pending withdrawal */
    if (timestamp > referenceTimestamp + groupingTimeSpan) {
      referenceTimestamp = timestamp;
      pendingWithdrawals.push({
        amount: new Celo(amount),
        timestamp: timestamp.toString(),
      });
      continue;
    }

    /* If next timestamp is within allowed time span merge it with the last pending withdrawal */
    const lastPendingWithdrawal = pendingWithdrawals[pendingWithdrawals.length - 1];
    lastPendingWithdrawal.timestamp = timestamp.toString();
    lastPendingWithdrawal.amount = new Celo(lastPendingWithdrawal.amount.plus(amount as any));
  }

  return pendingWithdrawals.reverse();
};

const pendingWithdrawalsLoadInterval = 60 * 1000;

export const useWithdrawals = (address: `0x${string}` | undefined) => {
  const { accountContract } = useBlockchain();
  const { data: pendingWithdrawal, refetch: loadPendingWithdrawals } = useContractRead({
    ...accountContract,
    functionName: 'getPendingWithdrawals',
    args: [address!],
    select: ([values, timestamps]) =>
      formatPendingWithdrawals(values as bigint[], timestamps as bigint[]),
    enabled: !!address,
  });

  useEffect(() => {
    if (!address) return;
    const intervalId = setInterval(loadPendingWithdrawals, pendingWithdrawalsLoadInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, [loadPendingWithdrawals, address]);

  return {
    pendingWithdrawals: pendingWithdrawal || [],
    loadPendingWithdrawals,
  };
};
