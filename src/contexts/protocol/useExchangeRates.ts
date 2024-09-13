import { sortedOraclesABI } from '@celo/abis';
import { useCallback, useMemo } from 'react';
import { WEI_PER_UNIT } from 'src/config/consts';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import useCeloRegistryAddress from 'src/hooks/useCeloRegistryAddress';
import { Celo, StCelo, Token } from 'src/utils/tokens';
import { useReadContract } from 'wagmi';

const ONE_CELO = new Celo(WEI_PER_UNIT);
const ONE_ST_CELO = new StCelo(WEI_PER_UNIT);

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

  const { data: _stakingRate, refetch: loadStakingRate } = useReadContract({
    ...managerContract,
    functionName: 'toStakedCelo',
    args: [ONE_CELO.toBigInt()],
  });

  const stakingRate = useMemo(
    () => new StCelo(_stakingRate).dividedBy(ONE_CELO).toNumber() || 0,
    [_stakingRate]
  );

  return {
    stakingRate,
    loadStakingRate,
  };
};

const useUnstakingRate = () => {
  const { managerContract } = useBlockchain();

  const { data: _unstakingRate, refetch: loadUnstakingRate } = useReadContract({
    ...managerContract,
    functionName: 'toCelo',
    args: [ONE_ST_CELO.toBigInt()],
  });

  const unstakingRate = useMemo(
    () => new Celo(_unstakingRate).dividedBy(ONE_ST_CELO).toNumber() || 0,
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
  const { data, isLoading } = useReadContract({
    abi: sortedOraclesABI,
    address: sortedOraclesAddress!,
    args: [stableTokenAddress!],
    functionName: 'medianRate',
    query: {
      enabled: !!stableTokenAddress && !!sortedOraclesAddress,
    },
  });

  const celoToUSDRate = useMemo(() => {
    if (isLoading || !data) return 0;

    const [rate, by] = data;
    return parseFloat(new Token(rate / by).toFixed(2));
  }, [isLoading, data]);

  return celoToUSDRate;
};
