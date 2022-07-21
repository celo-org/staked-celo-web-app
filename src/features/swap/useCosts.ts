import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  amount: number | undefined,
  exchangeRate: number,
  estimateGasFee: (amount: number) => Promise<BigNumber>
) => {
  const [gasFee, setGasFee] = useState(new BigNumber(0));

  const calculateGasFee = useCallback(async () => {
    if (!amount) return;
    const estimatedGasFee = await estimateGasFee(amount);
    setGasFee(estimatedGasFee);
  }, [estimateGasFee, amount]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    calculateGasFee();
  }, [calculateGasFee]);

  const calculatedCosts = useMemo(
    () => [
      {
        ...exchangeCost,
        value: exchangeRate ? exchangeRate.toFixed(DISPLAY_DECIMALS) : '...',
      },
      {
        ...transactionCost,
        value: gasFee.comparedTo(0.001) === -1 ? '< 0.001' : `~${gasFee.toFixed(DISPLAY_DECIMALS)}`,
      },
      feeCost,
    ],
    [exchangeRate, gasFee]
  );

  return {
    costs: calculatedCosts,
  };
};
