import { epochRewardsABI } from '@celo/abis';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import useCeloRegistryAddress from 'src/hooks/useCeloRegistryAddress';
import { useReadContract } from 'wagmi';

export const useAnnualProjectedRate = () => {
  const address = useCeloRegistryAddress('EpochRewards');
  const { data: rewardsMultiplierFraction, isLoading: multiplierLoading } = useReadContract({
    abi: epochRewardsABI,
    address,
    functionName: 'getRewardsMultiplier',
  });
  const { data: targetVotingYieldParameters, isLoading: yieldParamsLoading } = useReadContract({
    abi: epochRewardsABI,
    address,
    functionName: 'getTargetVotingYieldParameters',
  });

  const annualProjectedRate = useMemo(() => {
    if (
      multiplierLoading ||
      yieldParamsLoading ||
      !targetVotingYieldParameters ||
      !rewardsMultiplierFraction
    ) {
      return null;
    }

    // EpochRewards contract is using Fixidity library which operates on decimal part of numbers
    // Fixidity is always using 24 length decimal parts
    const fixidityDecimalSize = new BigNumber(10).pow(24);
    const [targetVotingYieldFraction] = targetVotingYieldParameters!;
    const targetVotingYield = new BigNumber(targetVotingYieldFraction.toString()).div(
      fixidityDecimalSize
    );
    const rewardsMultiplier = new BigNumber(rewardsMultiplierFraction!.toString()).div(
      fixidityDecimalSize
    );

    // Target voting yield is for a single day only, so we have to calculate this for entire year
    const unadjustedAPR = targetVotingYield.times(365);

    // According to the protocol it has to be adjusted by rewards multiplier
    const adjustedAPR = unadjustedAPR.times(rewardsMultiplier);

    const percentageAPR = adjustedAPR.times(100);

    return percentageAPR.toFixed(2);
  }, [
    rewardsMultiplierFraction,
    multiplierLoading,
    targetVotingYieldParameters,
    yieldParamsLoading,
  ]);

  return {
    annualProjectedRate,
  };
};
