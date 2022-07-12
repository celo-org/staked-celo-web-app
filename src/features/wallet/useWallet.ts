import { useCelo } from '@celo/react-celo';
import { useMemo } from 'react';

export function useWallet() {
  const { address, connect, destroy } = useCelo();
  const isConnected: boolean = useMemo(() => !!address, [address]);

  return {
    connectWallet: connect,
    disconnectWallet: destroy,
    isConnected,
  };
};
