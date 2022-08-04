import { useCallback, useEffect, useState } from 'react';
import {
  exchangeInfo,
  feeInfo,
  InfoItem,
  transactionInfo,
} from 'src/features/swap/utils/transactionInfo';
import { useStaking } from './useStaking';

export const useTransactionInfo = (amount: number | undefined) => {
  const { celoExchangeRate, estimateStakingFee } = useStaking();
  const [info, setInfo] = useState<InfoItem[]>([]);

  const loadInfo = useCallback(async () => {
    if (!amount) {
      setInfo([]);
    } else {
      const stakingFee = await estimateStakingFee(amount);
      setInfo([exchangeInfo(celoExchangeRate), transactionInfo(stakingFee), feeInfo()]);
    }
  }, [amount, estimateStakingFee, celoExchangeRate]);

  useEffect(() => {
    void loadInfo();
  }, [loadInfo]);

  return {
    info,
  };
};
