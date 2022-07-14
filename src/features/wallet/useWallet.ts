import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { AccountBalances } from 'src/features/wallet/types';
import { fromWei } from 'src/formatters/amount';
import logger from 'src/services/logger';

export function useWalletConnection() {
  const { address: _address, connect, destroy } = useCelo();
  const address = _address ?? undefined;
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
    connectWallet,
    disconnectWallet,
    changeWallet,
    changingWallet,
    isConnected,
  };
}

export function useWalletBalances() {
  const { account, kit } = useCelo();

  const [balances, setBalances] = useState<AccountBalances>({
    CELO: new BigNumber(0),
    stCELO: new BigNumber(0),
  });

  const loadBalances = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!account) return;

    const weiCELOBalance = fromWei(new BigNumber(await eth.getBalance(account)));

    setBalances({
      CELO: weiCELOBalance,
      stCELO: new BigNumber(0),
    });
  }, [kit.connection, account]);

  return {
    balances,
    loadBalances,
  };
}

export function useWallet() {
  return {
    ...useWalletConnection(),
    ...useWalletBalances(),
  };
}
