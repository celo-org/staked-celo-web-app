import { useCelo } from '@celo/react-celo';
import { useCallback, useState } from 'react';
import logger from 'src/services/logger';
import { walletEvent } from '../../../utils/ga';

export function useWallet() {
  const { connect, destroy, walletType } = useCelo();

  const connectWallet = useCallback(async () => {
    try {
      walletEvent({
        action: 'connect-wallet',
        status: 'initiated',
        label: 'N/A',
      });
      const connection = await connect();

      walletEvent({
        action: 'connect-wallet',
        status: 'completed',
        label: connection.type.toString(),
      });
      return true;
    } catch (error: any) {
      logger.error(error?.message);
      return false;
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      walletEvent({
        action: 'disconnect-wallet',
        status: 'initiated',
        label: walletType.toString(),
      });
      await destroy();

      walletEvent({
        action: 'disconnect-wallet',
        status: 'completed',
        label: 'N/A',
      });
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
    connectWallet,
    disconnectWallet,
    changeWallet,
    changingWallet,
  };
}
