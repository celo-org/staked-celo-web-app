import { useCallback, useEffect, useState } from 'react';
import { Detail, exchangeDetail, feeDetail, gasDetail } from 'src/features/swap/utils/details';
import { useUnstaking } from './useUnstaking';

export const useDetails = (amount: number | undefined) => {
  const { stCeloExchangeRate, estimateUnstakingGas } = useUnstaking();
  const [details, setDetails] = useState<Detail[]>([]);

  const loadDetails = useCallback(async () => {
    if (!amount) {
      setDetails([]);
    } else {
      const unstakingGas = await estimateUnstakingGas(amount);
      setDetails([exchangeDetail(stCeloExchangeRate), gasDetail(unstakingGas), feeDetail()]);
    }
  }, [amount, estimateUnstakingGas, stCeloExchangeRate]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  return {
    details,
  };
};
