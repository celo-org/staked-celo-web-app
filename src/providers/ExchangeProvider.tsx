import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toCeloWei, toStCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { Celo, CeloWei, StCelo, StCeloWei } from 'src/types/units';

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

const useStCeloExchangeRate = () => {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const [stCeloExchangeRate, setStCeloExchangeRate] = useState(0);

  const loadStCeloExchangeRate = useCallback(async () => {
    const oneStCeloWei = toStCeloWei(new StCelo('1')).toString();
    const celoAmount = new CeloWei(
      await managerContract.methods.toCelo(oneStCeloWei).call({ from: address })
    );
    setStCeloExchangeRate(celoAmount.dividedBy(oneStCeloWei).toNumber());
  }, [managerContract, address]);

  return {
    stCeloExchangeRate,
    loadStCeloExchangeRate,
  };
};

const useExchangeRate = () => {
  const { celoExchangeRate, loadCeloExchangeRate } = useCeloExchangeRate();
  const { stCeloExchangeRate, loadStCeloExchangeRate } = useStCeloExchangeRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadCeloExchangeRate(), loadStCeloExchangeRate()]);
  }, [loadCeloExchangeRate, loadStCeloExchangeRate]);

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
