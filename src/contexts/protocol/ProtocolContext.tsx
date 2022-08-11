import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { Celo } from 'src/utils/tokens';
import { useAnnualProjectedYield } from './useAnnualProjectedYield';
import { useExchangeRates } from './useExchangeRates';
import { useTokenBalances } from './useTokenBalances';

interface ProtocolContext {
  stakingRate: number;
  unstakingRate: number;
  loadExchangeRates: () => Promise<void>;
  totalCeloBalance: Celo;
  loadTokenBalances: () => Promise<void>;
  annualProjectedYield: string | null;
}

export const ProtocolContext = createContext<ProtocolContext>({
  stakingRate: 0,
  unstakingRate: 0,
  loadExchangeRates: () => Promise.resolve(),
  totalCeloBalance: new Celo(0),
  loadTokenBalances: () => Promise.resolve(),
  annualProjectedYield: null,
});

export const ProtocolProvider = ({ children }: PropsWithChildren) => {
  const { stakingRate, unstakingRate, loadExchangeRates } = useExchangeRates();
  const { totalCeloBalance, loadTokenBalances } = useTokenBalances();
  const { annualProjectedYield } = useAnnualProjectedYield();

  return (
    <ProtocolContext.Provider
      value={{
        stakingRate,
        unstakingRate,
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
    stakingRate,
    unstakingRate,
    loadExchangeRates,
    totalCeloBalance,
    loadTokenBalances,
    annualProjectedYield,
  } = useContext(ProtocolContext);

  const reloadProtocolContext = useCallback(async () => {
    await Promise.all([loadTokenBalances(), loadExchangeRates()]);
  }, [loadTokenBalances, loadExchangeRates]);

  return {
    stakingRate,
    unstakingRate,
    totalCeloBalance,
    annualProjectedYield,
    reloadProtocolContext,
  };
}
