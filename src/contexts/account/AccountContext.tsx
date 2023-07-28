import { createContext, PropsWithChildren, useContext } from 'react';
import useStrategy from 'src/contexts/account/useStrategy';
import { Option } from 'src/types';
import { Celo, StCelo } from 'src/utils/tokens';
import { Address, useAccount } from 'wagmi';
import { useAccountBalances } from './useBalances';
import {
  PendingWithdrawal,
  useClaimingBot,
  useWithdrawalBot,
  useWithdrawals,
} from './useWithdrawals';

interface AccountContext {
  isConnected: boolean;
  address: Option<Address>;
  celoBalance: Celo;
  stCeloBalance: StCelo;
  loadBalances: Option<ReturnType<typeof useAccountBalances>['loadBalances']>;
  pendingWithdrawals: PendingWithdrawal[];
  loadPendingWithdrawals: Option<ReturnType<typeof useWithdrawals>['loadPendingWithdrawals']>;
  strategy: Option<Address>;
  reloadStrategy: Option<ReturnType<typeof useStrategy>['reloadStrategy']>;
}

export const AccountContext = createContext<AccountContext>({
  isConnected: false,
  address: undefined,
  celoBalance: new Celo(0),
  stCeloBalance: new StCelo(0),
  loadBalances: undefined,
  pendingWithdrawals: [],
  loadPendingWithdrawals: undefined,
  strategy: undefined,
  reloadStrategy: undefined,
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAccount();

  const { loadBalances, celoBalance, stCeloBalance } = useAccountBalances(address);
  const { pendingWithdrawals, loadPendingWithdrawals } = useWithdrawals(address);
  useWithdrawalBot(address);
  useClaimingBot(address);

  const { strategy, reloadStrategy } = useStrategy(address);

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
        reloadStrategy,
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
    reloadStrategy,
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
    reloadStrategy,
  };
}
