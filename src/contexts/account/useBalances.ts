import { useCallback, useMemo } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Option } from 'src/types';
import { Celo, StCelo } from 'src/utils/tokens';
import type { Address } from 'viem';
import { useBalance, useReadContract } from 'wagmi';

export const useAccountBalances = (address: Option<Address>) => {
  const { stakedCeloContract } = useBlockchain();
  const {
    data: rawCeloBalance,
    refetch: refetchCelo,
    fetchStatus,
  } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { data: stCeloBalance, refetch: refetchStCelo } = useReadContract({
    ...stakedCeloContract,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address,
      select: (data) => new StCelo(data),
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- force update when fetchStatus changes
  const celoBalance = useMemo(() => new Celo(rawCeloBalance || 0), [rawCeloBalance, fetchStatus]);
  const loadBalances = useCallback(
    () => Promise.all([refetchCelo(), refetchStCelo()]),
    [refetchCelo, refetchStCelo]
  );

  return {
    celoBalance,
    stCeloBalance: stCeloBalance || ZERO,
    loadBalances,
  };
};

const ZERO = new StCelo(0);
