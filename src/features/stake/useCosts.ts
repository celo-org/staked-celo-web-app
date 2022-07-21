import { useCallback, useEffect, useMemo, useState } from 'react';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { fromCeloWei, toCeloWei } from 'src/formatters/amount';
import { useExchangeRates } from 'src/hooks/useExchangeRates';
import { Celo } from 'src/types/units';
import { Cost } from '../swap/types';
import { useStaking } from './useStaking';

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

export const useCosts = (amount: number | undefined) => {
  const { celoExchangeRate } = useExchangeRates();
  const { estimateStakingFee } = useStaking();

  const [gasFee, setGasFee] = useState(new Celo(0));

  const calculateGasFee = useCallback(async () => {
    if (!amount) return;
    const estimatedGasFee = await estimateStakingFee(toCeloWei(new Celo(amount)));
    setGasFee(fromCeloWei(estimatedGasFee));
  }, [estimateStakingFee, amount]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    calculateGasFee();
  }, [calculateGasFee]);

  const calculatedCosts = useMemo(
    () => [
      {
        ...exchangeCost,
        value: celoExchangeRate ? celoExchangeRate.toFixed(DISPLAY_DECIMALS) : '...',
      },
      {
        ...transactionCost,
        value: gasFee.comparedTo(0.001) === -1 ? '< 0.001' : `~${gasFee.toFixed(DISPLAY_DECIMALS)}`,
      },
      feeCost,
    ],
    [celoExchangeRate, gasFee]
  );

  return {
    costs: calculatedCosts,
  };
};
