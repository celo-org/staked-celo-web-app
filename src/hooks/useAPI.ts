import { useCelo } from '@celo/react-celo';
import { useMemo } from 'react';
import { mainnetAPIUrl, testnetAPIUrl } from 'src/config/services';
import { createAPI } from 'src/services/api';

export function useAPI() {
  const { network } = useCelo();

  const api = useMemo(() => {
    if (network.name === 'Mainnet') return createAPI(mainnetAPIUrl);
    return createAPI(testnetAPIUrl);
  }, [network]);

  return { api };
}
