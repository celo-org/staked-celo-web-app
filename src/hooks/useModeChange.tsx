import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Mode } from 'src/types';
import { useChainId } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';

export default function useModeChange() {
  const router = useRouter();
  const currentChain = useChainId();
  const onModeChange = useCallback(
    (mode: Mode) => {
      void router.push({
        pathname: `/${mode}`,
        query: currentChain === celoAlfajores.id ? { chainId: currentChain } : {},
      });
    },
    [router, currentChain]
  );

  return onModeChange;
}
