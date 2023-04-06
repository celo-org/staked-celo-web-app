import { ChainId, useCelo } from '@celo/react-celo'
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Mode } from 'src/types';

export default function useModeChange() {
  const router = useRouter();
  const { network } = useCelo();
  const currentChain = network.chainId
  const onModeChange = useCallback(
    (mode: Mode) => {
      void router.push({
        pathname: `/${mode}`,
        query: currentChain === ChainId.Alfajores ? {chainId: currentChain} : {}
      });
    },
    [router, currentChain]
  );

  return onModeChange;
}
