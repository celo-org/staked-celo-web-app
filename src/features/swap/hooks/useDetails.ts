import { useMemo } from 'react';
import { Detail, exchangeDetail, feeDetail, gasDetail } from 'src/features/swap/utils/details';
import { Token } from 'src/utils/tokens';
import { Mode } from '../types';

export const periodDetail: Detail = {
  title: 'Unstake period',
  value: '3 days',
  tooltip: {
    content:
      'Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by the Celo protocol.',
  },
};

export const useDetails = (mode: Mode, exchangeRate: number, gasFee: Token) => {
  const details: Detail[] = useMemo(() => {
    if (mode === 'unstake') return [exchangeDetail(exchangeRate), gasDetail(gasFee), feeDetail()];
    return [exchangeDetail(exchangeRate), gasDetail(gasFee), feeDetail(), periodDetail];
  }, [gasFee, exchangeRate, mode]);

  return {
    details,
  };
};
