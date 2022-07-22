import { useCelo } from '@celo/react-celo';
import { useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import { CeloWei, StCeloWei } from 'src/types/units';
import { useAddress } from './useAddress';

export const useBalances = () => {
  const { kit } = useCelo();
  const { address } = useAddress();
  const { stCeloContract } = useContracts();

  const [celoBalance, setCeloBalance] = useState(new CeloWei(0));
  const [stCeloBalance, setStCeloBalance] = useState(new StCeloWei(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new CeloWei(balance));
  }, [kit.connection, address]);

  const loadStCeloBalance = useCallback(async () => {
    const stCeloBalance = await stCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStCeloBalance(new StCeloWei(stCeloBalance));
  }, [address, stCeloContract]);

  const loadBalances = useCallback(async () => {
    await Promise.all([loadCeloBalance(), loadStCeloBalance()]);
  }, [loadCeloBalance, loadStCeloBalance]);

  useEffect(() => {
    if (!address) return;
    void loadBalances();
  }, [address, loadBalances]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances,
  };
};
