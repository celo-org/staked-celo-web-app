import { useCelo } from '@celo/react-celo';
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import { CeloWei, StCeloWei } from 'src/types/units';

interface AccountContext {
  isConnected: boolean;
  address: string | undefined | null;
  celoBalance: CeloWei;
  stCeloBalance: StCeloWei;
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
  const { stCeloContract } = useContracts();

  const [celoBalance, setCeloBalance] = useState(new CeloWei(0));
  const [stCeloBalance, setStakedCeloBalance] = useState(new StCeloWei(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new CeloWei(balance));
  }, [kit.connection, address]);

  const loadStakedCeloBalance = useCallback(async () => {
    const stCeloBalance = await stCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStakedCeloBalance(new StCeloWei(stCeloBalance));
  }, [address, stCeloContract]);

  const loadBalances = useCallback(async () => {
    await Promise.all([loadCeloBalance(), loadStakedCeloBalance()]);
  }, [loadCeloBalance, loadStakedCeloBalance]);

  useEffect(() => {
    if (!address) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadBalances();
  }, [address, loadBalances]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances,
  };
};

export const AccountContext = createContext<AccountContext>({
  isConnected: false,
  address: null,
  celoBalance: new CeloWei(0),
  stCeloBalance: new StCeloWei(0),
  loadBalances: () => Promise.resolve(),
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAddress();
  const { loadBalances, celoBalance, stCeloBalance } = useBalances();

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        address,
        loadBalances,
        celoBalance,
        stCeloBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
