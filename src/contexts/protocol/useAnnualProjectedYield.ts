import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/hooks/useBlockchain';

export const useAnnualProjectedYield = () => {
  const { epochRewardsContract } = useBlockchain();
  const [annualProjectedYield, setAnnualProjectedYield] = useState<string | null>(null);

  const loadAnnualProjectedYield = useCallback(async () => {
    if (!epochRewardsContract) return;
    const [rewardsMultiplier, { 0: targetVotingYield }] = await Promise.all([
      epochRewardsContract.methods.getRewardsMultiplier().call(),
      epochRewardsContract.methods.getTargetVotingYieldParameters().call(),
    ]);

    const divider = new BigNumber(10).pow(24);
    const apy = new BigNumber(targetVotingYield)
      .div(divider)
      .plus(1)
      .pow(365)
      .minus(1)
      .times(rewardsMultiplier)
      .div(divider)
      .times(100);
    setAnnualProjectedYield(apy.toFixed(2));
  }, [epochRewardsContract]);

  useEffect(() => {
    void loadAnnualProjectedYield();
  }, [loadAnnualProjectedYield]);

  return {
    annualProjectedYield,
  };
};
