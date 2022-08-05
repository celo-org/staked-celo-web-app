import { useCallback, useEffect, useState } from 'react';
import { Detail, exchangeDetail, feeDetail, gasDetail } from 'src/features/swap/utils/details';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export const periodDetail: Detail = {
  title: 'Unstake period',
  value: '3 days',
  tooltip: {
    content:
      'Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by the Celo protocol.',
  },
};

export const useDetails = (mode: Mode) => {
  const { celoExchangeRate, estimateStakingGas } = useStaking();
  const { stCeloExchangeRate, estimateUnstakingGas } = useUnstaking();

  const [details, setDetails] = useState<Detail[]>([]);
  const exchangeRate = mode === 'stake' ? celoExchangeRate : stCeloExchangeRate;
  const estimateGas = mode === 'stake' ? estimateStakingGas : estimateUnstakingGas;

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
