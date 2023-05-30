import { createContext, PropsWithChildren, useContext } from 'react';
import { useProposalVotes, VoteRecords } from 'src/contexts/account/useProposalVotes';
import useStrategy from 'src/contexts/account/useStrategy';
import { Celo, StCelo } from 'src/utils/tokens';
import { useAccount } from 'wagmi';
import { useAccountBalances } from './useBalances';
import {
  PendingWithdrawal,
  useClaimingBot,
  useWithdrawalBot,
  useWithdrawals,
} from './useWithdrawals';

interface AccountContext {
  isConnected: boolean;
  address: `0x${string}` | undefined;
  celoBalance: Celo;
  stCeloBalance: StCelo;
  loadBalances: ReturnType<typeof useAccountBalances>['loadBalances'] | undefined;
  pendingWithdrawals: PendingWithdrawal[];
  loadPendingWithdrawals: ReturnType<typeof useWithdrawals>['loadPendingWithdrawals'] | undefined;
  strategy: `0x${string}` | undefined;
  reloadStrategy: ReturnType<typeof useStrategy>['reloadStrategy'] | undefined;
  votes: VoteRecords;
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
  votes: {},
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAccount();

  const { loadBalances, celoBalance, stCeloBalance } = useAccountBalances(address);
  const { pendingWithdrawals, loadPendingWithdrawals } = useWithdrawals(address);
  useWithdrawalBot(/*address*/);
  useClaimingBot(address);

  const { strategy, reloadStrategy } = useStrategy(address);
  const { votes } = useProposalVotes(address);

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
        votes,
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
    votes,
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
    votes,
  };
}
