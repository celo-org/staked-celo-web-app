import { createContext, PropsWithChildren, useContext } from 'react';
import { useAddress } from 'src/hooks/useAddress';
import { useBalances } from 'src/hooks/useBalances';
import { useWithdrawals } from 'src/hooks/useWithdrawals';
import { PendingWithdrawal } from 'src/types/account';
import { CeloWei, StCeloWei } from 'src/types/units';

interface AccountContext {
  isConnected: boolean;
  address: string | null;
  celoBalance: CeloWei;
  stCeloBalance: StCeloWei;
  loadBalances: () => Promise<void>;
  pendingWithdrawals: PendingWithdrawal[];
}

export const AccountContext = createContext<AccountContext>({
  isConnected: false,
  address: null,
  celoBalance: new CeloWei(0),
  stCeloBalance: new StCeloWei(0),
  loadBalances: () => Promise.resolve(),
  pendingWithdrawals: [],
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAddress();
  const { loadBalances, celoBalance, stCeloBalance } = useBalances(address);
  const { pendingWithdrawals } = useWithdrawals(address);

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        address,
        loadBalances,
        celoBalance,
        stCeloBalance,
        pendingWithdrawals,
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
