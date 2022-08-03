import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, CeloWei, fromCeloWei } from 'src/utils/tokens';

export const useTokenBalances = () => {
  const { accountContract } = useBlockchain();

  const [totalCeloBalance, setTotalCeloBalance] = useState<Celo>(new Celo(0));
  const loadTotalCeloBalance = useCallback(async () => {
    const totalCeloWei = new CeloWei(await accountContract.methods.getTotalCelo().call());
    setTotalCeloBalance(fromCeloWei(totalCeloWei));
  }, [accountContract]);

  const loadTokenBalances = useCallback(async () => {
    await Promise.all([loadTotalCeloBalance()]);
  }, [loadTotalCeloBalance]);

  useEffect(() => {
    void loadTokenBalances();
  }, [loadTokenBalances]);

  return {
    totalCeloBalance,
    loadTokenBalances,
  };
};
