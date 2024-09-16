import { useMemo } from 'react';
import { mainnetAddresses, testnetAddresses } from 'src/config/contracts';
import { celo as Celo } from 'viem/chains';
import { usePublicClient } from 'wagmi';

export default function useAddresses() {
  const publicClient = usePublicClient();

  const addresses = useMemo(() => {
    if (publicClient!.chain.id === Celo.id) return mainnetAddresses;
    return testnetAddresses;
  }, [publicClient]);

  return addresses;
}
