import { useCallback, useEffect, useState } from 'react';
import { toCeloWei, toStCeloWei } from 'src/formatters/amount';
import { useAddress } from 'src/hooks/useAddress';
import { useContracts } from 'src/hooks/useContracts';
import { Celo, CeloWei, StCelo, StCeloWei } from 'src/types/units';

const useCeloExchangeRate = () => {
  const { address } = useAddress();
  const { managerContract } = useContracts();

  const [celoExchangeRate, setCeloExchangeRate] = useState(0);

  const loadCeloExchangeRate = useCallback(async () => {
    const oneCeloWei = toCeloWei(new Celo('1')).toFixed();
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
  const { address } = useAddress();
  const { managerContract } = useContracts();

  const [stCeloExchangeRate, setStCeloExchangeRate] = useState(0);

  const loadStCeloExchangeRate = useCallback(async () => {
    const oneStCeloWei = toStCeloWei(new StCelo('1')).toFixed();
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
