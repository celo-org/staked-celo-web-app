import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { Celo } from 'src/utils/tokens';
import { useAnnualProjectedRate } from './useAnnualProjectedRate';
import { useExchangeRates } from './useExchangeRates';
import { useTokenBalances } from './useTokenBalances';

interface ProtocolContext {
  stakingRate: number;
  unstakingRate: number;
  celoToUSDRate: number;
  loadExchangeRates: () => Promise<void>;
  totalCeloBalance: Celo;
  loadTokenBalances: () => Promise<void>;
  annualProjectedRate: string | null;
}

export const ProtocolContext = createContext<ProtocolContext>({
  stakingRate: 0,
  unstakingRate: 0,
  celoToUSDRate: 0,
  loadExchangeRates: () => Promise.resolve(),
  totalCeloBalance: new Celo(0),
  loadTokenBalances: () => Promise.resolve(),
  annualProjectedRate: null,
});

export const ProtocolProvider = ({ children }: PropsWithChildren) => {
  const { stakingRate, unstakingRate, celoToUSDRate, loadExchangeRates } = useExchangeRates();
  const { totalCeloBalance, loadTokenBalances } = useTokenBalances();
  const { annualProjectedRate } = useAnnualProjectedRate();

  return (
    <ProtocolContext.Provider
      value={{
        stakingRate,
        unstakingRate,
        celoToUSDRate,
        loadExchangeRates,
        totalCeloBalance,
        loadTokenBalances,
        annualProjectedRate,
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
    celoToUSDRate,
    loadExchangeRates,
    totalCeloBalance,
    loadTokenBalances,
    annualProjectedRate,
  } = useContext(ProtocolContext);

  const reloadProtocolContext = useCallback(async () => {
    await Promise.all([loadTokenBalances(), loadExchangeRates()]);
  }, [loadTokenBalances, loadExchangeRates]);

  return {
    stakingRate,
    unstakingRate,
    celoToUSDRate,
    totalCeloBalance,
    annualProjectedRate,
    reloadProtocolContext,
  };
}
