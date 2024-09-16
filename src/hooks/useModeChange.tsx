import Router from 'next/router';
import { useCallback } from 'react';
import { Mode } from 'src/types';
import { celoAlfajores as Alfajores } from 'viem/chains';
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
