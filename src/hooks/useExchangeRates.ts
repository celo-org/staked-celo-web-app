import { useContext } from 'react';
import { ExchangeContext } from 'src/providers/ExchangeProvider';

export function useExchangeRates() {
  const { celoExchangeRate, stakedCeloExchangeRate } = useContext(ExchangeContext);

  return {
    celoExchangeRate,
    stakedCeloExchangeRate,
  };
}
