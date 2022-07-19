import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';

export function useStaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract } = useContracts();

  const createTxOptions = useCallback(
    (celoAmount: BigNumber) => ({
      from: address,
      value: celoAmount.toString(),
    }),
    [address]
  );

  const deposit = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const [isStaking, setIsStaking] = useState(false);
  const stake = useCallback(
    async (celoAmount: BigNumber) => {
      setIsStaking(true);
      await deposit().send(createTxOptions(celoAmount));
      await loadBalances();
      setIsStaking(false);
    },
    [createTxOptions, deposit, loadBalances]
  );

  const estimateFee = useCallback(
    async (celoAmount: BigNumber): Promise<BigNumber> => {
      const estimatedFee = new BigNumber(await deposit().estimateGas(createTxOptions(celoAmount)));
      return estimatedFee.plus(estimatedFee.dividedBy(10));
    },
    [createTxOptions, deposit]
  );

  return {
    stake,
    isStaking,
    estimateFee,
  };
}
