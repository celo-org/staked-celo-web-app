import { useContext } from 'react';
import { ExchangeContext } from 'src/providers/ExchangeProvider';

export function useExchangeRates() {
  const { celoExchangeRate, stCeloExchangeRate } = useContext(ExchangeContext);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
  };
}
