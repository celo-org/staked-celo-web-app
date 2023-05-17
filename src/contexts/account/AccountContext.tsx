import { createContext, PropsWithChildren, useContext } from 'react';
import { useProposalVotes, VoteRecords } from 'src/contexts/account/useProposalVotes';
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
  reloadStrategy: (address: string | null) => Promise<void>;
  votes: VoteRecords;
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
  reloadStrategy: () => Promise.resolve(),
  votes: {},
});

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { isConnected, address } = useAccountAddress();
  const { loadBalances, celoBalance, stCeloBalance } = useAccountBalances(address);
  const { pendingWithdrawals, loadPendingWithdrawals } = useWithdrawals(address);
  useWithdrawalBot(address);
  useClaimingBot(address);

  const [strategy, reloadStrategy] = useStrategy(address);
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
