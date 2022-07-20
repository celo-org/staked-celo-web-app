import { useCelo } from '@celo/react-celo';
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import { CeloWei, StakedCeloWei } from 'src/types/units';

interface IAccountContext {
  isConnected: boolean;
  address: string | undefined | null;
  celoBalance: CeloWei;
  stakedCeloBalance: StakedCeloWei;
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

  const [celoBalance, setCeloBalance] = useState(new CeloWei(0));
  const [stakedCeloBalance, setStakedCeloBalance] = useState(new StakedCeloWei(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new CeloWei(balance));
  }, [kit.connection, address]);

  const loadStakedCeloBalance = useCallback(async () => {
    const stakedCeloBalance = await stakedCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStakedCeloBalance(new StakedCeloWei(stakedCeloBalance));
  }, [address, stakedCeloContract]);

  const loadBalances = useCallback(async () => {
    await Promise.all([loadCeloBalance(), loadStakedCeloBalance()]);
  }, [loadCeloBalance, loadStakedCeloBalance]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadBalances();
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
  celoBalance: new CeloWei(0),
  stakedCeloBalance: new StakedCeloWei(0),
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
