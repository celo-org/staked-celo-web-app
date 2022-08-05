import { useCallback, useEffect, useState } from 'react';
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

export const useDetails = (mode: Mode, exchangeRate: number, estimateGas: () => Promise<Token>) => {
  const [details, setDetails] = useState<Detail[]>([]);

  const loadDetails = useCallback(async () => {
    const stakingGas = await estimateGas();
    const loadedDetails = [exchangeDetail(exchangeRate), gasDetail(stakingGas), feeDetail()];
    if (mode === 'stake') loadedDetails.push(periodDetail);
    setDetails(loadedDetails);
  }, [estimateGas, exchangeRate, mode]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  return {
    details,
  };
};
