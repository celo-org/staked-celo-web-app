import { useCallback, useEffect, useState } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { useBlockchain } from 'src/hooks/useBlockchain';
import { CeloWei, StCeloWei } from 'src/utils/tokens';

const useCeloExchangeRate = () => {
  const { managerContract } = useBlockchain();

  const [celoExchangeRate, setCeloExchangeRate] = useState(0);

  const loadCeloExchangeRate = useCallback(async () => {
    const oneCeloWei = new CeloWei(WEI_PER_UNIT);
    const stCeloAmount = new StCeloWei(
      await managerContract.methods.toStakedCelo(oneCeloWei.toFixed()).call()
    );
    setCeloExchangeRate(stCeloAmount.dividedBy(oneCeloWei).toNumber());
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
    const oneStCeloWei = new StCeloWei(WEI_PER_UNIT);
    const celoAmount = new CeloWei(
      await managerContract.methods.toCelo(oneStCeloWei.toFixed()).call()
    );
    setStCeloExchangeRate(celoAmount.dividedBy(oneStCeloWei).toNumber());
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
