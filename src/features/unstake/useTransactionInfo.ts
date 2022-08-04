import { useCallback, useEffect, useState } from 'react';
import {
  exchangeInfo,
  feeInfo,
  InfoItem,
  transactionInfo,
} from 'src/features/swap/utils/transactionInfo';
import { useUnstaking } from './useUnstaking';

export const useTransactionInfo = (amount: number | undefined) => {
  const { stCeloExchangeRate, estimateUnstakingFee } = useUnstaking();
  const [info, setInfo] = useState<InfoItem[]>([]);

  const loadInfo = useCallback(async () => {
    if (!amount) {
      setInfo([]);
    } else {
      const unstakingFee = await estimateUnstakingFee(amount);
      setInfo([exchangeInfo(stCeloExchangeRate), transactionInfo(unstakingFee), feeInfo()]);
    }
  }, [amount, estimateUnstakingFee, stCeloExchangeRate]);

  useEffect(() => {
    void loadInfo();
  }, [loadInfo]);

  return {
    info,
  };
};
