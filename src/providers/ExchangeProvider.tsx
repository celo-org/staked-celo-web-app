import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { Celo, StakedCeloWei } from 'src/types/units';

interface IExchangeContext {
  celoExchangeRate: number;
  stakedCeloExchangeRate: number;
  loadExchangeRates: () => Promise<void>;
}

const useCeloExchangeRate = () => {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const [celoExchangeRate, setCeloExchangeRate] = useState(0);

  const loadCeloExchangeRate = useCallback(async () => {
    const oneCeloWei = toCeloWei(new Celo('1')).toString();
    const stakedCeloAmount = new StakedCeloWei(
      await managerContract.methods.toStakedCelo(oneCeloWei).call({ from: address })
    );
    setCeloExchangeRate(stakedCeloAmount.dividedBy(oneCeloWei).toNumber());
  }, [managerContract, address]);

  return {
    celoExchangeRate,
    loadCeloExchangeRate,
  };
};

const useExchangeRate = () => {
  const { celoExchangeRate, loadCeloExchangeRate } = useCeloExchangeRate();

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
