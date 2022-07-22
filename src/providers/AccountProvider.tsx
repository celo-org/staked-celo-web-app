import { createContext, PropsWithChildren, useContext } from 'react';
import { useAddress } from 'src/hooks/useAddress';
import { useBalances } from 'src/hooks/useBalances';
import { CeloWei, StCeloWei } from 'src/types/units';

interface AccountContext {
  isConnected: boolean;
  address: string | undefined | null;
  celoBalance: CeloWei;
  stCeloBalance: StCeloWei;
  loadBalances: () => Promise<void>;
}

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

export function useAccountContext() {
  const { isConnected, address, celoBalance, stCeloBalance, loadBalances } =
    useContext(AccountContext);

  return {
    isConnected,
    address,
    celoBalance,
    stCeloBalance,
    loadBalances,
  };
}
