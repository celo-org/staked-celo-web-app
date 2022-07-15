import BigNumber from 'bignumber.js';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';

export function useStaking() {
  const { address } = useAccount();
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

  const estimateStakedCeloDeposit = async (celoAmount: BigNumber) =>
    managerContract.methods.toStakedCelo(celoAmount.toString()).call({ from: address });

  return {
    stake,
    estimateStakingFee,
    estimateStakedCeloDeposit,
  };
}
