import { useContext } from 'react';
import { AccountContext } from 'src/providers/AccountProvider';

export function useAccount() {
  const { isConnected, address, celoBalance, stakedCeloBalance, loadBalances } =
    useContext(AccountContext);

  return {
    isConnected,
    address,
    celoBalance,
    stakedCeloBalance,
    loadBalances,
  };
}
