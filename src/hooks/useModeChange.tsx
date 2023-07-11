import { Alfajores } from '@celo/rainbowkit-celo/chains';
import Router from 'next/router';
import { useCallback } from 'react';
import { Mode } from 'src/types';
import { useChainId } from 'wagmi';

export default function useModeChange() {
  const currentChain = useChainId();

  const onModeChange = useCallback(
    (mode: Mode) => {
      void Router.push({
        pathname: `/${mode}`,
        query: currentChain === Alfajores.id ? { chainId: currentChain } : {},
      });
    },
    [currentChain]
  );

  return onModeChange;
}
