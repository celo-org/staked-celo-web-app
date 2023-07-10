import { Celo } from '@celo/rainbowkit-celo/chains';
import { useMemo } from 'react';
import { mainnetAddresses, testnetAddresses } from 'src/config/contracts';
import { usePublicClient } from 'wagmi';

export default function useAddresses() {
  const publicClient = usePublicClient();

  const addresses = useMemo(() => {
    if (publicClient.chain.id === Celo.id) return mainnetAddresses;
    return testnetAddresses;
  }, [publicClient]);

  return addresses;
}
