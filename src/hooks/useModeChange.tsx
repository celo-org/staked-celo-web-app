import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Mode } from 'src/types';
import { useChainId } from 'wagmi';
import { Alfajores } from '@celo/rainbowkit-celo/chains';

export default function useModeChange() {
  const router = useRouter();
  const currentChain = useChainId();
  const onModeChange = useCallback(
    (mode: Mode) => {
      void router.push({
        pathname: `/${mode}`,
        query: currentChain === Alfajores.id ? { chainId: currentChain } : {},
      });
    },
    [router, currentChain]
  );

  return onModeChange;
}
