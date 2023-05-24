import { useMemo } from 'react';
import StakedCeloABI from 'src/blockchain/ABIs/StakedCelo';
import useAddresses from 'src/hooks/useAddresses';
import { Celo, StCelo } from 'src/utils/tokens';
import { useBalance, useContractRead } from 'wagmi';

export const useAccountBalances = (address: `0x${string}` | undefined) => {
  const addresses = useAddresses();
  const { data: rawCeloBalance, refetch: refetchCelo } = useBalance({
    address: address,
  });
  const { data: rawStCeloBalance, refetch: refetchStCelo } = useContractRead({
    abi: StakedCeloABI,
    address: address ? addresses.stakedCelo : undefined,
    functionName: 'balanceOf',
    args: [address!],
  });

  const celoBalance = useMemo(() => new Celo(rawCeloBalance || 0), [rawCeloBalance]);
  const stCeloBalance = useMemo(() => new StCelo(rawStCeloBalance || 0), [rawStCeloBalance]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances: () => Promise.all([refetchCelo(), refetchStCelo()]),
  };
};
