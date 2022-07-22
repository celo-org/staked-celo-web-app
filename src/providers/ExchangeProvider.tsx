import { createContext, PropsWithChildren, useContext } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';

interface ExchangeContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
  loadExchangeRates: () => Promise<void>;
}

export const ExchangeContext = createContext<ExchangeContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
  loadExchangeRates: () => Promise.resolve(),
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate, loadExchangeRates } = useExchangeRates();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
        loadExchangeRates,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export function useExchangeContext() {
  const { celoExchangeRate, stCeloExchangeRate } = useContext(ExchangeContext);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
  };
}
