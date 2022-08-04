import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS } from 'src/config/consts';

export interface Detail {
  title: string;
  value: string | number;
  tooltip: {
    content: string;
  };
}

export const freePriceValue = 'Free*';

export const exchangeDetail = (exchangeRate?: number): Detail => ({
  title: 'Exchange Rate',
  value: exchangeRate ? exchangeRate.toFixed(DISPLAY_DECIMALS) : '...',
  tooltip: {
    content:
      'stCELO’s exchange rate continuously accrues value vs CELO. As you receive rewards, your amount of stCELO will not change but when you unstake it will be worth more CELO than what you paid.',
  },
});

export const gasDetail = (gasFee?: BigNumber): Detail => {
  const value =
    gasFee &&
    (gasFee.comparedTo(0.001) === -1 ? '< 0.001' : `~${gasFee.toFixed(DISPLAY_DECIMALS)}`);
  return {
    title: 'Transaction cost',
    value: value || '...',
    tooltip: {
      content:
        'Every blockchain transaction requires gas fees to be paid. The amount mentioned is an estimate of these gas costs.',
    },
  };
};

export const feeDetail = (): Detail => ({
  title: 'Fees',
  value: freePriceValue,
  tooltip: {
    content: 'For the launch of the stCELO protocol, fees are free.',
  },
});
