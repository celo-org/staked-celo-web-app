import { useMemo } from 'react';
import { mainnetAPIUrl, testnetAPIUrl } from 'src/config/services';
import { createAPI } from 'src/services/api';
import { useChainId } from 'wagmi';
import { celo } from 'wagmi/chains';

export function useAPI() {
  const chainId = useChainId();
  const api = useMemo(() => {
    if (chainId === celo.id) return createAPI(mainnetAPIUrl);
    return createAPI(testnetAPIUrl);
  }, [chainId]);

  return { api };
}
