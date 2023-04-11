import { useCelo } from '@celo/react-celo';
import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo, StCelo } from 'src/utils/tokens';

export const useAccountBalances = (address: string | null) => {
  const { kit } = useCelo();
  const { stCeloContract } = useBlockchain();

  const [celoBalance, setCeloBalance] = useState(new Celo(0));
  const [stCeloBalance, setStCeloBalance] = useState(new StCelo(0));

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new Celo(balance));
  }, [kit.connection, address]);

  const loadStCeloBalance = useCallback(async () => {
    if (!address || !stCeloContract) {
      return;
    }
    const stCeloBalance = await stCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStCeloBalance(new StCelo(stCeloBalance));
  }, [address, stCeloContract]);

  const loadBalances = useCallback(async () => {
    await Promise.all([loadCeloBalance(), loadStCeloBalance()]);
  }, [loadCeloBalance, loadStCeloBalance]);

  useEffect(() => {
    void loadBalances();
  }, [address, loadBalances]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances,
  };
};
