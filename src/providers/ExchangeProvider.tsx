import { createContext, PropsWithChildren, useContext } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';

interface ExchangeContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
}

export const ExchangeContext = createContext<ExchangeContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate } = useExchangeRates();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
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
