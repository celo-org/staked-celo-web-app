import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { AccountBalances } from 'src/features/wallet/types';
import logger from 'src/services/logger';

const balances: AccountBalances = {
  CELO: new BigNumber(WEI_PER_UNIT).multipliedBy(50),
  stCELO: new BigNumber(WEI_PER_UNIT).multipliedBy(30),
};

export function useWallet() {
  const { address, connect, destroy } = useCelo();
  const isConnected: boolean = useMemo(() => !!address, [address]);

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
    balances,
    connectWallet,
    disconnectWallet,
    changeWallet,
    changingWallet,
    isConnected,
  };
}
