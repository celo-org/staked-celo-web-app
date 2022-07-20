import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toCeloWei, toStakedCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { Celo, CeloWei, StakedCelo, StakedCeloWei } from 'src/types/units';

interface ExchangeContext {
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

const useStakedCeloExchangeRate = () => {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const [stakedCeloExchangeRate, setStakedCeloExchangeRate] = useState(0);

  const loadStakedCeloExchangeRate = useCallback(async () => {
    const oneStakedCeloWei = toStakedCeloWei(new StakedCelo('1')).toString();
    const celoAmount = new CeloWei(
      await managerContract.methods.toCelo(oneStakedCeloWei).call({ from: address })
    );
    setStakedCeloExchangeRate(celoAmount.dividedBy(oneStakedCeloWei).toNumber());
  }, [managerContract, address]);

  return {
    stakedCeloExchangeRate,
    loadStakedCeloExchangeRate,
  };
};

const useExchangeRate = () => {
  const { celoExchangeRate, loadCeloExchangeRate } = useCeloExchangeRate();
  const { stakedCeloExchangeRate, loadStakedCeloExchangeRate } = useStakedCeloExchangeRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadCeloExchangeRate(), loadStakedCeloExchangeRate()]);
  }, [loadCeloExchangeRate, loadStakedCeloExchangeRate]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadExchangeRates();
  }, [loadExchangeRates]);

  return {
    celoExchangeRate,
    stakedCeloExchangeRate,
    loadExchangeRates,
  };
};

export const ExchangeContext = createContext<ExchangeContext>({
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
