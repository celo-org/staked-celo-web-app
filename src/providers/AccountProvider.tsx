import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import logger from 'src/services/logger';

interface IAccountContext {
  isConnected: boolean;
  address: string | undefined | null;
  celoBalance: BigNumber;
  stakedCeloBalance: BigNumber;
  loadBalances: () => Promise<void>;
}

const useAddress = () => {
  const { address: _address } = useCelo();
  const address = _address ?? undefined;
  const isConnected = !!address;
  return { isConnected, address };
};

const useBalances = () => {
  const { kit } = useCelo();
  const { address } = useAddress();
  const { stakedCeloContract } = useContracts();

  const [celoBalance, setCeloBalance] = useState(new BigNumber(0));
  const [stakedCeloBalance, setStakedCeloBalance] = useState(new BigNumber(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new BigNumber(balance));
  }, [kit.connection, address]);

  const loadStakedCeloBalance = useCallback(async () => {
    const stakedCeloBalance = await stakedCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStakedCeloBalance(new BigNumber(stakedCeloBalance));
  }, [address, stakedCeloContract]);

  const loadBalances = useCallback(async () => {
    await Promise.all([loadCeloBalance(), loadStakedCeloBalance()]);
  }, [loadCeloBalance, loadStakedCeloBalance]);

  useEffect(() => {
    loadBalances().catch((error: any) => logger.error(error?.message));
  }, [loadBalances]);

  return {
    celoBalance,
    stakedCeloBalance,
    loadBalances,
  };
};

export const AccountContext = createContext<IAccountContext>({
  isConnected: false,
  address: null,
  celoBalance: new BigNumber(0),
  stakedCeloBalance: new BigNumber(0),
  loadBalances: () => Promise.resolve(),
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAddress();
  const { loadBalances, celoBalance, stakedCeloBalance } = useBalances();

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        address,
        loadBalances,
        celoBalance,
        stakedCeloBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
