import { useCallback } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';

export function useEstimations() {
  const { celoExchangeRate } = useExchangeRates();

  const estimateDepositValue = useCallback(
    (amount: number) => amount * celoExchangeRate,
    [celoExchangeRate]
  );

  return {
    estimateDepositValue,
  };
}
