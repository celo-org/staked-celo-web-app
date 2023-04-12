import { createContext, PropsWithChildren, useContext } from 'react';
import useStrategy from 'src/contexts/account/useStrategy';
import { Celo, StCelo } from 'src/utils/tokens';
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
  celoBalance: Celo;
  stCeloBalance: StCelo;
  loadBalances: () => Promise<void>;
  pendingWithdrawals: PendingWithdrawal[];
  loadPendingWithdrawals: () => Promise<void>;
  strategy: string | null;
}

export const AccountContext = createContext<AccountContext>({
  isConnected: false,
  address: null,
  celoBalance: new Celo(0),
  stCeloBalance: new StCelo(0),
  loadBalances: () => Promise.resolve(),
  pendingWithdrawals: [],
  loadPendingWithdrawals: () => Promise.resolve(),
  strategy: null,
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAccountAddress();
  const { loadBalances, celoBalance, stCeloBalance } = useAccountBalances(address);
  const { pendingWithdrawals, loadPendingWithdrawals } = useWithdrawals(address);
  useWithdrawalBot(address);
  useClaimingBot(address);

  const strategy = useStrategy(address);

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
        strategy,
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
    strategy,
  } = useContext(AccountContext);

  return {
    isConnected,
    address,
    celoBalance,
    stCeloBalance,
    loadBalances,
    pendingWithdrawals,
    loadPendingWithdrawals,
    strategy,
  };
}
