import { useCallback, useEffect, useState } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo, StCelo, Token } from 'src/utils/tokens';

export const useExchangeRates = () => {
  const { stakingRate, loadStakingRate } = useStakingRate();
  const { unstakingRate, loadUnstakingRate } = useUnstakingRate();
  const { celoToUSDRate, loadCeloToUSDRate } = useCeloToUSDRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadStakingRate(), loadUnstakingRate(), loadCeloToUSDRate()]);
  }, [loadStakingRate, loadUnstakingRate, loadCeloToUSDRate]);

  useEffect(() => {
    void loadExchangeRates();
  }, [loadExchangeRates]);

  return {
    stakingRate,
    unstakingRate,
    celoToUSDRate,
    loadExchangeRates,
  };
};

const useStakingRate = () => {
  const { managerContract } = useBlockchain();

  const [stakingRate, setCeloExchangeRate] = useState(0);

  const loadStakingRate = useCallback(async () => {
    const oneCelo = new Celo(WEI_PER_UNIT);
    if (!managerContract) {
      return;
    }
    const stCeloAmount = new StCelo(
      await managerContract.contract.read.toStakedCelo([oneCelo.toFixed()])
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
    if (!managerContract) {
      return;
    }
    const oneStCelo = new StCelo(WEI_PER_UNIT);
    const celoAmount = new Celo(await managerContract.contract.read.toCelo([oneStCelo.toFixed()]));
    setStCeloExchangeRate(celoAmount.dividedBy(oneStCelo).toNumber());
  }, [managerContract]);

  return {
    unstakingRate,
    loadUnstakingRate,
  };
};

const useCeloToUSDRate = () => {
  const { sortedOraclesContract, stableTokenContract } = useBlockchain();
  const [celoToUSDRate, setCeloToUSDRate] = useState(0);

  const loadCeloToUSDRate = useCallback(async () => {
    if (!sortedOraclesContract || !stableTokenContract) return;
    const [rate, by] = await sortedOraclesContract.contract.read.medianRate([
      stableTokenContract.address,
    ]);
    setCeloToUSDRate(parseFloat(new Token(rate).dividedBy(new Token(by)).toFixed(2)));
  }, [sortedOraclesContract, stableTokenContract]);

  return {
    celoToUSDRate,
    loadCeloToUSDRate,
  };
};
