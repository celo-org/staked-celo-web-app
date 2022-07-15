import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useContracts } from 'src/hooks/useContracts';

export function useStaking() {
  const { address } = useCelo();
  const { managerContract } = useContracts();

  const createTxOptions = (celoAmount: BigNumber) => ({
    from: address,
    value: celoAmount.toString(),
  });

  const deposit = () => managerContract.methods.deposit();

  const stake = (celoAmount: BigNumber) => deposit().send(createTxOptions(celoAmount));

  const estimateStakingFee = async (celoAmount: BigNumber): Promise<BigNumber> => {
    const estimatedFee = new BigNumber(await deposit().estimateGas(createTxOptions(celoAmount)));
    return estimatedFee.plus(estimatedFee.dividedBy(10));
  };

  return {
    stake,
    estimateStakingFee,
  };
}
