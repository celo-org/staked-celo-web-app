import { createContext, PropsWithChildren, useContext } from 'react';
import { CeloWei, StCeloWei } from 'src/utils/tokens';
import { useAccountAddress } from './useAddress';
import { useAccountBalances } from './useBalances';
import {
  PendingWithdrawal,
  useClaimingBot,
  useWithdrawalBot,
  useWithdrawals,
} from './useWithdrawals';

interface AccountContext {
  isConnected: boolean;
  address: string | null;
  celoBalance: CeloWei;
  stCeloBalance: StCeloWei;
  loadBalances: () => Promise<void>;
  pendingWithdrawals: PendingWithdrawal[];
  loadPendingWithdrawals: () => Promise<void>;
}

export const AccountContext = createContext<AccountContext>({
  isConnected: false,
  address: null,
  celoBalance: new CeloWei(0),
  stCeloBalance: new StCeloWei(0),
  loadBalances: () => Promise.resolve(),
  pendingWithdrawals: [],
  loadPendingWithdrawals: () => Promise.resolve(),
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAccountAddress();
  const { loadBalances, celoBalance, stCeloBalance } = useAccountBalances(address);
  const { pendingWithdrawals, loadPendingWithdrawals } = useWithdrawals(address);
  useWithdrawalBot(address);
  useClaimingBot(address);

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        address,
        loadBalances,
        celoBalance,
        stCeloBalance,
        pendingWithdrawals,
        loadPendingWithdrawals,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export function useAccountContext() {
  const {
    isConnected,
    address,
    celoBalance,
    stCeloBalance,
    loadBalances,
    pendingWithdrawals,
    loadPendingWithdrawals,
  } = useContext(AccountContext);

  return {
    isConnected,
    address,
    celoBalance,
    stCeloBalance,
    loadBalances,
    pendingWithdrawals,
    loadPendingWithdrawals,
  };
}
