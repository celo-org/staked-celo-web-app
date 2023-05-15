import { Celo } from '@celo/rainbowkit-celo/chains';
import { useMemo } from 'react';
import { mainnetAPIUrl, testnetAPIUrl } from 'src/config/services';
import { createAPI } from 'src/services/api';
import { useChainId } from 'wagmi';

export function useAPI() {
  const chainId = useChainId();
  const api = useMemo(() => {
    if (chainId === Celo.id) return createAPI(mainnetAPIUrl);
    return createAPI(testnetAPIUrl);
  }, [chainId]);

  return { api };
}
