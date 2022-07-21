import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { Cost } from '../swap/types';

const exchangeCost: Cost = {
  title: 'Exchange Rate',
  value: '...',
  tooltip: {
    content:
      'stCELO’s exchange rate continuously accrues value vs CELO. As you receive rewards, your amount of stCELO will not change but when you unstake it will be worth more CELO than what you paid.',
  },
};

const transactionCost: Cost = {
  title: 'Transaction Cost',
  value: '...',
  tooltip: {
    content:
      'Every blockchain transaction requires gas fees to be paid. The amount mentioned is an estimate of these gas costs.',
  },
};

const feeCost: Cost = {
  title: 'Fees',
  value: 'Free*',
  tooltip: {
    content: 'For the launch of the stCELO protocol, fees are free.',
  },
};

export const useCosts = (
  amount: number,
  exchangeRate: number,
  estimateGasFee: (amount: number) => Promise<BigNumber>
) => {
  const [costs, setCosts] = useState<Cost[]>([]);

  const calculateCosts = useCallback(async () => {
    console.log(amount);
    if (!amount) {
      setCosts([]);
    } else {
      const gasFee = await estimateGasFee(amount);
      setCosts([
        {
          ...exchangeCost,
          value: exchangeRate ? exchangeRate.toFixed(DISPLAY_DECIMALS) : '...',
        },
        {
          ...transactionCost,
          value:
            gasFee.comparedTo(0.001) === -1 ? '< 0.001' : `~${gasFee.toFixed(DISPLAY_DECIMALS)}`,
        },
        feeCost,
      ]);
    }
  }, [amount]);

  useEffect(() => {
    void calculateCosts();
  }, [calculateCosts]);

  return {
    costs,
  };
};
