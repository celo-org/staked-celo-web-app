import { createContext, PropsWithChildren, useContext } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';
import { useTokenBalances } from 'src/hooks/useTokensBalances';
import { Celo } from 'src/types/units';

interface ExchangeContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
  totalCeloBalance: Celo;
}

export const ExchangeContext = createContext<ExchangeContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
  totalCeloBalance: new Celo(0),
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate } = useExchangeRates();
  const { totalCeloBalance } = useTokenBalances();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
        totalCeloBalance,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export function useExchangeContext() {
  const { celoExchangeRate, stCeloExchangeRate, totalCeloBalance } = useContext(ExchangeContext);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
    totalCeloBalance,
  };
}
