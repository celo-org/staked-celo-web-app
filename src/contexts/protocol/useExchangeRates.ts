import { useCallback, useMemo } from 'react';
import { useSortedOraclesMedianRate } from 'src/blockchain/ABIs/Celo';
import { WEI_PER_UNIT } from 'src/config/consts';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import useCeloRegistryAddress from 'src/hooks/useCeloRegistryAddress';
import { Celo, StCelo, Token } from 'src/utils/tokens';
import { useContractRead } from 'wagmi';

export const useExchangeRates = () => {
  const { stakingRate, loadStakingRate } = useStakingRate();
  const { unstakingRate, loadUnstakingRate } = useUnstakingRate();
  const celoToUSDRate = useCeloToUSDRate();

  const loadExchangeRates = useCallback(async () => {
    await Promise.all([loadStakingRate(), loadUnstakingRate()]);
  }, [loadStakingRate, loadUnstakingRate]);

  return {
    stakingRate,
    unstakingRate,
    celoToUSDRate,
    loadExchangeRates,
  };
};

const useStakingRate = () => {
  const { managerContract } = useBlockchain();

  const oneCelo = new Celo(WEI_PER_UNIT);
  const { data: _stakingRate, refetch: loadStakingRate } = useContractRead({
    ...managerContract,
    functionName: 'toStakedCelo',
    args: [oneCelo.toBigInt()],
  });

  const stakingRate = useMemo(
    () => new StCelo(_stakingRate).dividedBy(oneCelo).toNumber() || 0,
    [_stakingRate]
  );

  return {
    stakingRate,
    loadStakingRate,
  };
};

const useUnstakingRate = () => {
  const { managerContract } = useBlockchain();

  const oneStCelo = new StCelo(WEI_PER_UNIT);
  const { data: _unstakingRate, refetch: loadUnstakingRate } = useContractRead({
    ...managerContract,
    functionName: 'toCelo',
    args: [oneStCelo.toBigInt()],
  });

  const unstakingRate = useMemo(
    () => new Celo(_unstakingRate).dividedBy(oneStCelo).toNumber() || 0,
    [_unstakingRate]
  );

  return {
    unstakingRate,
    loadUnstakingRate,
  };
};

const useCeloToUSDRate = () => {
  const sortedOraclesAddress = useCeloRegistryAddress('SortedOracles');
  const stableTokenAddress = useCeloRegistryAddress('StableToken');
  const { data, isLoading } = useSortedOraclesMedianRate({
    address: stableTokenAddress ? sortedOraclesAddress : undefined,
    args: [stableTokenAddress!],
  });

  const celoToUSDRate = useMemo(() => {
    if (isLoading || !data) return 0;

    const [rate, by] = data;
    return parseFloat(new Token(rate / by).toFixed(2));
  }, [isLoading, data]);

  return celoToUSDRate;
};
