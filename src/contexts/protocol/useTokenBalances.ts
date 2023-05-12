import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo } from 'src/utils/tokens';

export const useTokenBalances = () => {
  const { accountContract } = useBlockchain();

  const [totalCeloBalance, setTotalCeloBalance] = useState<Celo>(new Celo(0));
  const loadTotalCeloBalance = useCallback(async () => {
    if (!accountContract) {
      return;
    }
    const totalCelo = new Celo(await accountContract.contract.read.getTotalCelo());
    setTotalCeloBalance(totalCelo);
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
