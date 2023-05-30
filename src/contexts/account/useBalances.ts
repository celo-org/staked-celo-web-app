import { useMemo } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo, StCelo } from 'src/utils/tokens';
import { useBalance, useContractRead } from 'wagmi';

export const useAccountBalances = (address: `0x${string}` | undefined) => {
  const { stakedCeloContract } = useBlockchain();
  const { data: rawCeloBalance, refetch: refetchCelo } = useBalance({
    address,
  });
  const { data: rawStCeloBalance, refetch: refetchStCelo } = useContractRead({
    ...stakedCeloContract,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
  });

  const celoBalance = useMemo(() => new Celo(rawCeloBalance || 0), [rawCeloBalance]);
  const stCeloBalance = useMemo(() => new StCelo(rawStCeloBalance || 0), [rawStCeloBalance]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances: () => Promise.all([refetchCelo(), refetchStCelo()]),
  };
};
