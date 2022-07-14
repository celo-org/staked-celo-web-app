import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';

export function useAccount() {
  const { address: _address, kit } = useCelo();
  const address = _address ?? undefined;

  const [celoBalance, setCeloBalance] = useState(new BigNumber(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new BigNumber(balance));
  }, [kit.connection, address]);

  return {
    address,
    celoBalance,
    loadCeloBalance,
  };
}
