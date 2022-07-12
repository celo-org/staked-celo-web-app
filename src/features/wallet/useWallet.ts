import { useCelo } from '@celo/react-celo';
import { useCallback, useMemo } from 'react';

export function useWallet() {
  const { address, connect, destroy } = useCelo();
  const isConnected: boolean = useMemo(() => !!address, [address]);

  const connectWallet = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error(error);
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      await destroy();
    } catch (error) {
      console.error(error);
    }
  }, [destroy]);

  return {
    connectWallet,
    disconnectWallet,
    isConnected,
  };
};
