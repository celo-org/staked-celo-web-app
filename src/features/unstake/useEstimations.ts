import { useCallback } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';

export function useEstimations() {
  const { stCeloExchangeRate } = useExchangeRates();

  const estimateWithdrawValue = useCallback(
    (amount: number) => amount * stCeloExchangeRate,
    [stCeloExchangeRate]
  );

  return {
    estimateWithdrawValue,
  };
}
