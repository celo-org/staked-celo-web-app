import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { AccountBalances } from 'src/features/wallet/types';

export class WalletConnectionFailed extends Error {}
export class WalletDisconnectionFailed extends Error {}

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
    } catch (error: any) {
      throw new WalletConnectionFailed(error?.message);
    }
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    try {
      await destroy();
    } catch (error: any) {
      throw new WalletDisconnectionFailed(error?.message);
    }
  }, [destroy]);

  const [changingWallet, setChangingWallet] = useState(false);
  const changeWallet = useCallback(async (): Promise<boolean> => {
    try {
      setChangingWallet(true);
      await connectWallet();
      setChangingWallet(false);
      return true;
    } catch (error) {
      setChangingWallet(false);
      return false;
    }
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
};
