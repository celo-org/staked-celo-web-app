import { useCelo } from '@celo/react-celo';
import { useCallback, useState } from 'react';
import logger from 'src/services/logger';

export function useWallet() {
  const { address: _address, connect, destroy } = useCelo();
  const address = _address ?? undefined;

  const connectWallet = useCallback(async () => {
    try {
      await connect();
      return true;
    } catch (error: any) {
      logger.error(error?.message);
      return false;
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      await destroy();
      return true;
    } catch (error: any) {
      logger.error(error?.message);
      return false;
    }
  }, [destroy]);

  const [changingWallet, setChangingWallet] = useState(false);
  const changeWallet = useCallback(async (): Promise<boolean> => {
    setChangingWallet(true);
    const changed = await connectWallet();
    setChangingWallet(false);
    return changed;
  }, [connectWallet]);

  return {
    address,
    connectWallet,
    disconnectWallet,
    changeWallet,
    changingWallet,
  };
}
