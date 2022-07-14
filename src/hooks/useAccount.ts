import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { AccountBalances } from 'src/features/wallet/types';

export function useAccount() {
  const { account, kit } = useCelo();

  const [balances, setBalances] = useState<AccountBalances>({
    CELO: new BigNumber(0),
    stCELO: new BigNumber(0),
  });

  const loadBalances = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!account) return;

    const weiBalance = await eth.getBalance(account);

    setBalances({
      CELO: new BigNumber(weiBalance),
      stCELO: new BigNumber(0),
    });
  }, [kit.connection, account]);

  return {
    balances,
    loadBalances,
  };
}
