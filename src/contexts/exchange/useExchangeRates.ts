import { useCallback, useEffect, useState } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, StCelo } from 'src/utils/tokens';

const useCeloExchangeRate = () => {
  const { managerContract } = useBlockchain();

  const [celoExchangeRate, setCeloExchangeRate] = useState(0);

  const loadCeloExchangeRate = useCallback(async () => {
    const oneCelo = new Celo(WEI_PER_UNIT);
    const stCeloAmount = new StCelo(
      await managerContract.methods.toStakedCelo(oneCelo.toFixed()).call()
    );
    setCeloExchangeRate(stCeloAmount.dividedBy(oneCelo).toNumber());
  }, [managerContract]);

  return {
    celoExchangeRate,
    loadCeloExchangeRate,
  };
};

const useStCeloExchangeRate = () => {
  const { managerContract } = useBlockchain();

  const [stCeloExchangeRate, setStCeloExchangeRate] = useState(0);

  const loadStCeloExchangeRate = useCallback(async () => {
    const oneStCelo = new StCelo(WEI_PER_UNIT);
    const celoAmount = new Celo(await managerContract.methods.toCelo(oneStCelo.toFixed()).call());
    setStCeloExchangeRate(celoAmount.dividedBy(oneStCelo).toNumber());
  }, [managerContract]);

  return {
    stCeloExchangeRate,
    loadStCeloExchangeRate,
  };
};

export const useExchangeRates = () => {
  const { celoExchangeRate, loadCeloExchangeRate } = useCeloExchangeRate();
  const { stCeloExchangeRate, loadStCeloExchangeRate } = useStCeloExchangeRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadCeloExchangeRate(), loadStCeloExchangeRate()]);
  }, [loadCeloExchangeRate, loadStCeloExchangeRate]);

  useEffect(() => {
    void loadExchangeRates();
  }, [loadExchangeRates]);

  return {
    celoExchangeRate,
    stCeloExchangeRate,
    loadExchangeRates,
  };
};
