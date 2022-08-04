import { useCallback, useEffect, useState } from 'react';
import { Cost, exchangeCost, feeCost, transactionCost } from 'src/features/swap/utils/costs';
import { useStaking } from './useStaking';

export const useCosts = (amount: number | undefined) => {
  const { celoExchangeRate, estimateStakingFee } = useStaking();
  const [costs, setCosts] = useState<Cost[]>([]);

  const calculateCosts = useCallback(async () => {
    if (!amount) {
      setCosts([]);
    } else {
      const stakingFee = await estimateStakingFee(amount);
      setCosts([exchangeCost(celoExchangeRate), transactionCost(stakingFee), feeCost()]);
    }
  }, [amount, estimateStakingFee, celoExchangeRate]);

  useEffect(() => {
    void calculateCosts();
  }, [calculateCosts]);

  return {
    costs,
  };
};
