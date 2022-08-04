import { useCallback, useEffect, useState } from 'react';
import { Cost, exchangeCost, feeCost, transactionCost } from 'src/features/swap/utils/costs';
import { useUnstaking } from './useUnstaking';

export const useCosts = (amount: number | undefined) => {
  const { stCeloExchangeRate, estimateUnstakingFee } = useUnstaking();
  const [costs, setCosts] = useState<Cost[]>([]);

  const calculateCosts = useCallback(async () => {
    if (!amount) {
      setCosts([]);
    } else {
      const unstakingFee = await estimateUnstakingFee(amount);
      setCosts([exchangeCost(stCeloExchangeRate), transactionCost(unstakingFee), feeCost()]);
    }
  }, [amount, estimateUnstakingFee, stCeloExchangeRate]);

  useEffect(() => {
    void calculateCosts();
  }, [calculateCosts]);

  return {
    costs,
  };
};
