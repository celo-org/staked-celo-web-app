import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { AccountBalances } from 'src/features/wallet/types';

export function useAccount() {
  const { address: _address, kit } = useCelo();
  const address = _address ?? undefined;

  const [balances, setBalances] = useState<AccountBalances>({
    CELO: new BigNumber(0),
    stCELO: new BigNumber(0),
  });

  const loadBalances = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const weiBalance = await eth.getBalance(address);

    setBalances({
      CELO: new BigNumber(weiBalance),
      stCELO: new BigNumber(0),
    });
  }, [kit.connection, address]);

  return {
    address,
    balances,
    loadBalances,
  };
}
