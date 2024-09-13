import { readContract } from '@wagmi/core';
import { useCallback, useEffect } from 'react';
import useDefaultGroups from 'src/contexts/account/useDefaultGroups';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useAPI } from 'src/hooks/useAPI';
import { Option } from 'src/types';
import { Celo } from 'src/utils/tokens';
import type { Address } from 'viem';
import { useConfig, usePublicClient, useReadContract } from 'wagmi';
export interface PendingWithdrawal {
  amount: Celo;
  timestamp: string;
}

const botActionInterval = 180 * 1000;

export const useWithdrawalBot = (address: Option<Address>) => {
  const { api } = useAPI();
  const { accountContract } = useBlockchain();
  const config = useConfig();
  const { activeGroups: groups } = useDefaultGroups();

  const finalizeWithdrawal = useCallback(async () => {
    if (!address) return;
    if (!groups.length) return;

    for (const group of groups) {
      const scheduledWithdrawals = await readContract(config, {
        address: accountContract.address!,
        abi: accountContract.abi,
        functionName: 'scheduledWithdrawalsForGroupAndBeneficiary',
        args: [group, address],
      });

      if (scheduledWithdrawals > 0) return api.withdraw(address);
    }
  }, [address, groups, accountContract, api, config]);

  useEffect(() => {
    void finalizeWithdrawal();
    const intervalId = setInterval(finalizeWithdrawal, botActionInterval);
    return () => {
      clearInterval(intervalId);
    };
  }, [finalizeWithdrawal]);
};

export const useClaimingBot = (address: Option<Address>) => {
  const { api } = useAPI();
  const { accountContract } = useBlockchain();
  const publicClient = usePublicClient();
  const { refetch: loadPendingWithdrawals } = useReadContract({
    ...accountContract,
    functionName: 'getPendingWithdrawals',
    args: [address!],
    query: { enabled: !!address },
  });

  const claim = useCallback(async () => {
    if (!address) return;

    const [{ timestamp: currentBlockTimestamp }, { data: valuesAndTimestamps }] = await Promise.all(
      [publicClient!.getBlock({ blockTag: 'latest' }), loadPendingWithdrawals()]
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

export const useWithdrawals = (address: Option<Address>) => {
  const { accountContract } = useBlockchain();
  const { data: pendingWithdrawal, refetch: loadPendingWithdrawals } = useReadContract({
    ...accountContract,
    functionName: 'getPendingWithdrawals',
    args: [address!],
    query: {
      enabled: !!address,
      select: ([values, timestamps]) =>
        formatPendingWithdrawals(values as bigint[], timestamps as bigint[]),
    },
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
