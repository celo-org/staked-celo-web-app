import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { Celo } from 'src/utils/tokens';
import { useTokenBalances } from './useTokenBalances';

interface ProtocolContext {
  totalCeloBalance: Celo;
  loadTokenBalances: () => Promise<void>;
}

export const ProtocolContext = createContext<ProtocolContext>({
  totalCeloBalance: new Celo(0),
  loadTokenBalances: () => Promise.resolve(),
});

export const ProtocolProvider = ({ children }: PropsWithChildren) => {
  const { totalCeloBalance, loadTokenBalances } = useTokenBalances();

  return (
    <ProtocolContext.Provider
      value={{
        totalCeloBalance,
        loadTokenBalances,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};

export function useProtocolContext() {
  const { totalCeloBalance, loadTokenBalances } = useContext(ProtocolContext);

  const reloadProtocolContext = useCallback(async () => {
    await Promise.all([loadTokenBalances()]);
  }, [loadTokenBalances]);

  return {
    totalCeloBalance,
    reloadProtocolContext,
  };
}
