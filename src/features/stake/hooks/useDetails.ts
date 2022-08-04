import { useCallback, useEffect, useState } from 'react';
import { Detail, exchangeDetail, feeDetail, gasDetail } from 'src/features/swap/utils/details';
import { CeloWei } from 'src/utils/tokens';
import { useStaking } from './useStaking';

export const periodDetail: Detail = {
  title: 'Unstake period',
  value: '3 days',
  tooltip: {
    content:
      'Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by the Celo protocol.',
  },
};

export const useDetails = (amount: CeloWei) => {
  const { celoExchangeRate, estimateStakingGas } = useStaking();
  const [details, setDetails] = useState<Detail[]>([]);

  const loadDetails = useCallback(async () => {
    if (amount.isEqualTo(0)) {
      setDetails([]);
      return;
    }

    const stakingGas = await estimateStakingGas(amount);
    setDetails([
      exchangeDetail(celoExchangeRate),
      gasDetail(stakingGas),
      feeDetail(),
      periodDetail,
    ]);
  }, [amount, estimateStakingGas, celoExchangeRate]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  return {
    details,
  };
};
