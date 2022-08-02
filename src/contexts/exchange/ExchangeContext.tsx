import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useExchangeRates } from 'src/contexts/exchange/useExchangeRates';
import { useTokenBalances } from 'src/contexts/exchange/useTokenBalances';
import { Celo } from 'src/utils/tokens';

interface ExchangeContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
  totalCeloBalance: Celo;
  loadExchangeRates: () => Promise<void>;
  loadTokenBalances: () => Promise<void>;
}

export const ExchangeContext = createContext<ExchangeContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
  totalCeloBalance: new Celo(0),
  loadExchangeRates: () => Promise.resolve(),
  loadTokenBalances: () => Promise.resolve(),
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate, loadExchangeRates } = useExchangeRates();
  const { totalCeloBalance, loadTokenBalances } = useTokenBalances();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
        totalCeloBalance,
        loadExchangeRates,
        loadTokenBalances,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export function useExchangeContext() {
  const {
    celoExchangeRate,
    stCeloExchangeRate,
    totalCeloBalance,
    loadExchangeRates,
    loadTokenBalances,
  } = useContext(ExchangeContext);

  const reloadExchangeContext = useCallback(async () => {
    await Promise.all([loadExchangeRates(), loadTokenBalances()]);
  }, [loadExchangeRates, loadTokenBalances]);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
    totalCeloBalance,
    reloadExchangeContext,
  };
}