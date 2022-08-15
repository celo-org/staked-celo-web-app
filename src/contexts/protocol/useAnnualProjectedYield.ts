import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/hooks/useBlockchain';

export const useAnnualProjectedYield = () => {
  const { epochRewardsContract } = useBlockchain();
  const [annualProjectedYield, setAnnualProjectedYield] = useState<string | null>(null);

  const loadAnnualProjectedYield = useCallback(async () => {
    if (!epochRewardsContract) return;
    const [rewardsMultiplierFraction, { 0: targetVotingYieldFraction }] = await Promise.all([
      epochRewardsContract.methods.getRewardsMultiplier().call(),
      epochRewardsContract.methods.getTargetVotingYieldParameters().call(),
    ]);

    // EpochRewards contract is using Fixidity library which operates on decimal part of numbers
    // Fixidity is always using 24 length decimal parts
    const fixidityDecimalSize = new BigNumber(10).pow(24);
    const targetVotingYield = new BigNumber(targetVotingYieldFraction).div(fixidityDecimalSize);
    const rewardsMultiplier = new BigNumber(rewardsMultiplierFraction).div(fixidityDecimalSize);

    // Target voting yield is for a single day only, so we have to calculate this for entire year
    // Check formula definition here: https://en.wikipedia.org/wiki/Annual_percentage_yield#Equation
    const unadjustedAPY = targetVotingYield.plus(1).pow(365).minus(1);

    // According to the protocol it has to be adjusted by rewards multiplier
    const adjustedApy = unadjustedAPY.times(rewardsMultiplier);

    const percentageAPY = adjustedApy.times(100);

    setAnnualProjectedYield(percentageAPY.toFixed(2));
  }, [epochRewardsContract]);

  useEffect(() => {
    void loadAnnualProjectedYield();
  }, [loadAnnualProjectedYield]);

  return {
    annualProjectedYield,
  };
};
