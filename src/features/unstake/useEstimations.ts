import { useCallback } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';

export function useEstimations() {
  const { stakedCeloExchangeRate } = useExchangeRates();

  const estimateWithdrawValue = useCallback(
    (amount: number) => amount * stakedCeloExchangeRate,
    [stakedCeloExchangeRate]
  );

  return {
    estimateWithdrawValue,
  };
}
