import { useCallback, useEffect, useState } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, StCelo } from 'src/utils/tokens';

export const useExchangeRates = () => {
  const { stakingRate, loadStakingRate } = useStakingRate();
  const { unstakingRate, loadUnstakingRate } = useUnstakingRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadStakingRate(), loadUnstakingRate()]);
  }, [loadStakingRate, loadUnstakingRate]);

  useEffect(() => {
    void loadExchangeRates();
  }, [loadExchangeRates]);

  return {
    stakingRate,
    unstakingRate,
    loadExchangeRates,
  };
};

const useStakingRate = () => {
  const { managerContract } = useBlockchain();

  const [stakingRate, setCeloExchangeRate] = useState(0);

  const loadStakingRate = useCallback(async () => {
    const oneCelo = new Celo(WEI_PER_UNIT);
    const stCeloAmount = new StCelo(
      await managerContract.methods.toStakedCelo(oneCelo.toFixed()).call()
    );
    setCeloExchangeRate(stCeloAmount.dividedBy(oneCelo).toNumber());
  }, [managerContract]);

  return {
    stakingRate,
    loadStakingRate,
  };
};

const useUnstakingRate = () => {
  const { managerContract } = useBlockchain();

  const [unstakingRate, setStCeloExchangeRate] = useState(0);

  const loadUnstakingRate = useCallback(async () => {
    const oneStCelo = new StCelo(WEI_PER_UNIT);
    const celoAmount = new Celo(await managerContract.methods.toCelo(oneStCelo.toFixed()).call());
    setStCeloExchangeRate(celoAmount.dividedBy(oneStCelo).toNumber());
  }, [managerContract]);

  return {
    unstakingRate,
    loadUnstakingRate,
  };
};
