import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';

export function useAccount() {
  const { address: _address, kit } = useCelo();
  const { stakedCeloContract } = useContracts();
  const address = _address ?? undefined;

  const [celoBalance, setCeloBalance] = useState(new BigNumber(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new BigNumber(balance));
  }, [kit.connection, address]);

  const [stakedCeloBalance, setStakedCeloBalance] = useState(new BigNumber(0));

  const loadStakedCeloBalance = useCallback(async () => {
    const stakedCeloBalance = await stakedCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStakedCeloBalance(new BigNumber(stakedCeloBalance));
  }, [address, stakedCeloContract]);

  return {
    address,
    celoBalance,
    loadCeloBalance,
    stakedCeloBalance,
    loadStakedCeloBalance,
  };
}
