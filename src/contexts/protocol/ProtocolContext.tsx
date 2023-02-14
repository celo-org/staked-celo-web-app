import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { GAS_PRICE } from 'src/config/consts';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { Celo } from 'src/utils/tokens';
import { useAnnualProjectedRate } from './useAnnualProjectedRate';
import { useExchangeRates } from './useExchangeRates';
import { useTokenBalances } from './useTokenBalances';

interface ProtocolContext {
  stakingRate: number;
  unstakingRate: number;
  celoToUSDRate: number;
  suggestedGasPrice: string;
  loadExchangeRates: () => Promise<void>;
  loadGasPrices: () => Promise<void>;
  totalCeloBalance: Celo;
  loadTokenBalances: () => Promise<void>;
  annualProjectedRate: string | null;
}

export const ProtocolContext = createContext<ProtocolContext>({
  stakingRate: 0,
  unstakingRate: 0,
  celoToUSDRate: 0,
  suggestedGasPrice: GAS_PRICE,
  loadExchangeRates: () => Promise.resolve(),
  loadGasPrices: () => Promise.resolve(),
  totalCeloBalance: new Celo(0),
  loadTokenBalances: () => Promise.resolve(),
  annualProjectedRate: null,
});

export const ProtocolProvider = ({ children }: PropsWithChildren) => {
  const { stakingRate, unstakingRate, celoToUSDRate, loadExchangeRates } = useExchangeRates();
  const { suggestedGasPrice, loadGasPrices } = useGasPrices();
  const { totalCeloBalance, loadTokenBalances } = useTokenBalances();
  const { annualProjectedRate } = useAnnualProjectedRate();

  return (
    <ProtocolContext.Provider
      value={{
        stakingRate,
        unstakingRate,
        celoToUSDRate,
        suggestedGasPrice,
        loadExchangeRates,
        loadGasPrices,
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
    suggestedGasPrice,
    loadExchangeRates,
    loadGasPrices,
    totalCeloBalance,
    loadTokenBalances,
    annualProjectedRate,
  } = useContext(ProtocolContext);

  const reloadProtocolContext = useCallback(async () => {
    await Promise.all([loadTokenBalances(), loadExchangeRates(), loadGasPrices()]);
  }, [loadTokenBalances, loadExchangeRates, loadGasPrices]);

  return {
    stakingRate,
    unstakingRate,
    celoToUSDRate,
    suggestedGasPrice,
    totalCeloBalance,
    annualProjectedRate,
    reloadProtocolContext,
  };
}
