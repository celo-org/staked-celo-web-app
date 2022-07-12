import { useCelo } from '@celo/react-celo';
import { useMemo } from 'react';

export function useWallet() {
  const { address } = useCelo();
  const isConnected: boolean = useMemo(() => !!address, [address]);

  return {
    isConnected,
  };
};
