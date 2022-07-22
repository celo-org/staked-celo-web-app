import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { useExchangeRates } from 'src/hooks/useExchangeRates';
import { useTokenBalances } from 'src/hooks/useTokensBalances';
import { Celo } from 'src/types/units';

interface ExchangeContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
  totalCeloBalance: Celo;
  loadExchangeRates: () => Promise<void>;
  loadTokensBalances: () => Promise<void>;
}

export const ExchangeContext = createContext<ExchangeContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
  totalCeloBalance: new Celo(0),
  loadExchangeRates: () => Promise.resolve(),
  loadTokensBalances: () => Promise.resolve(),
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate, loadExchangeRates } = useExchangeRates();
  const { totalCeloBalance, loadTokensBalances } = useTokenBalances();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
        totalCeloBalance,
        loadExchangeRates,
        loadTokensBalances,
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
    loadTokensBalances,
  } = useContext(ExchangeContext);

  const reloadExchangeContext = useCallback(async () => {
    await Promise.all([loadExchangeRates(), loadTokensBalances()]);
  }, [loadExchangeRates, loadTokensBalances]);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
    totalCeloBalance,
    reloadExchangeContext,
  };
}
