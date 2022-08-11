import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { Celo } from 'src/utils/tokens';
import { useAnnualProjectedYield } from './useAnnualProjectedYield';
import { useExchangeRates } from './useExchangeRates';
import { useTokenBalances } from './useTokenBalances';

interface ProtocolContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
  loadExchangeRates: () => Promise<void>;
  totalCeloBalance: Celo;
  loadTokenBalances: () => Promise<void>;
  annualProjectedYield: string | null;
}

export const ProtocolContext = createContext<ProtocolContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
  loadExchangeRates: () => Promise.resolve(),
  totalCeloBalance: new Celo(0),
  loadTokenBalances: () => Promise.resolve(),
  annualProjectedYield: null,
});

export const ProtocolProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate, loadExchangeRates } = useExchangeRates();
  const { totalCeloBalance, loadTokenBalances } = useTokenBalances();
  const { annualProjectedYield } = useAnnualProjectedYield();

  return (
    <ProtocolContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
        loadExchangeRates,
        totalCeloBalance,
        loadTokenBalances,
        annualProjectedYield,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};

export function useProtocolContext() {
  const {
    celoExchangeRate,
    stCeloExchangeRate,
    loadExchangeRates,
    totalCeloBalance,
    loadTokenBalances,
    annualProjectedYield,
  } = useContext(ProtocolContext);

  const reloadProtocolContext = useCallback(async () => {
    await Promise.all([loadTokenBalances(), loadExchangeRates()]);
  }, [loadTokenBalances, loadExchangeRates]);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
    totalCeloBalance,
    annualProjectedYield,
    reloadProtocolContext,
  };
}
