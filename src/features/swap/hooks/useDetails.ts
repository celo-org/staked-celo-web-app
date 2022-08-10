import { useMemo } from 'react';
import { Detail, exchangeDetail, feeDetail, gasDetail } from 'src/features/swap/utils/details';
import { Celo } from 'src/utils/tokens';
import { Mode } from '../types';

export const periodDetail: Detail = {
  title: 'Unstake period',
  value: '3 days',
  tooltip: {
    content:
      'Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by the Celo protocol.',
  },
};

export const useDetails = (mode: Mode, exchangeRate: number, gasFee: Celo) => {
  const details: Detail[] = useMemo(() => {
    switch (mode) {
      case 'unstake':
        return [exchangeDetail(exchangeRate), gasDetail(gasFee), feeDetail()];
      case 'stake':
        return [exchangeDetail(exchangeRate), gasDetail(gasFee), feeDetail(), periodDetail];
    }
  }, [gasFee, exchangeRate, mode]);

  return {
    details,
  };
};
