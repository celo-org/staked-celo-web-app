import { useCallback, useMemo } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Option } from 'src/types';
import { Celo, StCelo } from 'src/utils/tokens';
import { Address, useBalance, useContractRead } from 'wagmi';

export const useAccountBalances = (address: Option<Address>) => {
  const { stakedCeloContract } = useBlockchain();
  const { data: rawCeloBalance, refetch: refetchCelo } = useBalance({
    address,
    enabled: !!address,
  });
  const { data: rawStCeloBalance, refetch: refetchStCelo } = useContractRead({
    ...stakedCeloContract,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
  });

  const celoBalance = useMemo(() => new Celo(rawCeloBalance || 0), [rawCeloBalance]);
  const stCeloBalance = useMemo(() => new StCelo(rawStCeloBalance || 0), [rawStCeloBalance]);

  const loadBalances = useCallback(
    () => Promise.all([refetchCelo(), refetchStCelo()]),
    [refetchCelo, refetchStCelo]
  );

  return {
    celoBalance,
    stCeloBalance,
    loadBalances,
  };
};
