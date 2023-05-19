import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';

export const useAnnualProjectedRate = () => {
  const { epochRewardsContract } = useBlockchain();
  const [annualProjectedRate, setAnnualProjectedRate] = useState<string | null>(null);

  const loadAnnualProjectedRate = useCallback(async () => {
    if (!epochRewardsContract) return;
    const [rewardsMultiplierFraction, { 0: targetVotingYieldFraction }] = await Promise.all([
      epochRewardsContract.contract.read.getRewardsMultiplier() as Promise<bigint>,
      epochRewardsContract.contract.read.getTargetVotingYieldParameters() as Promise<{
        [x: number]: bigint;
      }>,
    ]);

    // EpochRewards contract is using Fixidity library which operates on decimal part of numbers
    // Fixidity is always using 24 length decimal parts
    const fixidityDecimalSize = new BigNumber(10).pow(24);
    const targetVotingYield = new BigNumber(targetVotingYieldFraction.toString()).div(
      fixidityDecimalSize
    );
    const rewardsMultiplier = new BigNumber(rewardsMultiplierFraction.toString()).div(
      fixidityDecimalSize
    );

    // Target voting yield is for a single day only, so we have to calculate this for entire year
    const unadjustedAPR = targetVotingYield.times(365);

    // According to the protocol it has to be adjusted by rewards multiplier
    const adjustedAPR = unadjustedAPR.times(rewardsMultiplier);

    const percentageAPR = adjustedAPR.times(100);

    setAnnualProjectedRate(percentageAPR.toFixed(2));
  }, [epochRewardsContract]);

  useEffect(() => {
    void loadAnnualProjectedRate();
  }, [loadAnnualProjectedRate]);

  return {
    annualProjectedRate,
  };
};
