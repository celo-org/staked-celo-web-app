import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toCeloWei, toStCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { Celo, CeloWei, StakedCelo, StCeloWei } from 'src/types/units';

interface ExchangeContext {
  celoExchangeRate: number;
  stCeloExchangeRate: number;
  loadExchangeRates: () => Promise<void>;
}

const useCeloExchangeRate = () => {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const [celoExchangeRate, setCeloExchangeRate] = useState(0);

  const loadCeloExchangeRate = useCallback(async () => {
    const oneCeloWei = toCeloWei(new Celo('1')).toString();
    const stCeloAmount = new StCeloWei(
      await managerContract.methods.toStakedCelo(oneCeloWei).call({ from: address })
    );
    setCeloExchangeRate(stCeloAmount.dividedBy(oneCeloWei).toNumber());
  }, [managerContract, address]);

  return {
    celoExchangeRate,
    loadCeloExchangeRate,
  };
};

const useStakedCeloExchangeRate = () => {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const [stCeloExchangeRate, setStakedCeloExchangeRate] = useState(0);

  const loadStakedCeloExchangeRate = useCallback(async () => {
    const oneStCeloWei = toStCeloWei(new StakedCelo('1')).toString();
    const celoAmount = new CeloWei(
      await managerContract.methods.toCelo(oneStCeloWei).call({ from: address })
    );
    setStakedCeloExchangeRate(celoAmount.dividedBy(oneStCeloWei).toNumber());
  }, [managerContract, address]);

  return {
    stCeloExchangeRate,
    loadStakedCeloExchangeRate,
  };
};

const useExchangeRate = () => {
  const { celoExchangeRate, loadCeloExchangeRate } = useCeloExchangeRate();
  const { stCeloExchangeRate, loadStakedCeloExchangeRate } = useStakedCeloExchangeRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadCeloExchangeRate(), loadStakedCeloExchangeRate()]);
  }, [loadCeloExchangeRate, loadStakedCeloExchangeRate]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadExchangeRates();
  }, [loadExchangeRates]);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
    loadExchangeRates,
  };
};

export const ExchangeContext = createContext<ExchangeContext>({
  celoExchangeRate: 0,
  stCeloExchangeRate: 0,
  loadExchangeRates: () => Promise.resolve(),
});

export const ExchangeProvider = ({ children }: PropsWithChildren) => {
  const { celoExchangeRate, stCeloExchangeRate, loadExchangeRates } = useExchangeRate();

  return (
    <ExchangeContext.Provider
      value={{
        celoExchangeRate,
        stCeloExchangeRate,
        loadExchangeRates,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};
