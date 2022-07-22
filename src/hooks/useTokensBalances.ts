import { useCallback, useEffect, useState } from 'react';
import { fromCeloWei } from 'src/formatters/amount';
import { useContracts } from 'src/hooks/useContracts';
import { Celo, CeloWei } from 'src/types/units';

export const useTokenBalances = () => {
  const { accountContract } = useContracts();

  const [totalCeloBalance, setTotalCeloBalance] = useState<Celo>(new Celo(0));
  const loadTotalCeloBalance = useCallback(async () => {
    const totalCeloWei = new CeloWei(await accountContract.methods.getTotalCelo().call());
    setTotalCeloBalance(fromCeloWei(totalCeloWei));
  }, [accountContract]);

  useEffect(() => {
    void loadTotalCeloBalance();
  }, [loadTotalCeloBalance]);

  return {
    totalCeloBalance,
  };
};
