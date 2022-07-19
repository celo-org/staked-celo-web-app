import BigNumber from 'bignumber.js';
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';

interface IExchangeContext {
  celoExchangeRate: number;
  stakedCeloExchangeRate: number;
  loadExchangeRates: () => Promise<void>;
}

const useExchangeRate = () => {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const [celoExchangeRate, setCeloExchangeRate] = useState(0);

  const loadCeloExchangeRate = useCallback(async () => {
    const oneCeloInWei = toWei(new BigNumber('1'));
    const stakedCeloAmount = new BigNumber(
      await managerContract.methods.toStakedCelo(oneCeloInWei).call({ from: address })
    );
    setCeloExchangeRate(stakedCeloAmount.dividedBy(oneCeloInWei).toNumber());
  }, [managerContract, address]);

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadCeloExchangeRate()]);
  }, [loadCeloExchangeRate]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadExchangeRates();
  }, [loadExchangeRates]);

  return {
    celoExchangeRate,
    stakedCeloExchangeRate: 0,
    loadExchangeRates,
  };
};

export const ExchangeContext = createContext<IExchangeContext>({
  celoExchangeRate: 0,
  stakedCeloExchangeRate: 0,
  loadExchangeRates: () => Promise.resolve(),
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stakedCeloExchangeRate, loadExchangeRates } = useExchangeRate();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stakedCeloExchangeRate,
        loadExchangeRates,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};
