import BigNumber from 'bignumber.js';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';

export function useUnstaking() {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const createTxOptions = () => ({
    from: address,
  });

  const withdraw = (stakedCeloAmount: BigNumber) =>
    managerContract.methods.withdraw(stakedCeloAmount.toString());

  const unstake = (stakedCeloAmount: BigNumber) =>
    withdraw(stakedCeloAmount).send(createTxOptions());

  const estimateUnstakingFee = async (stakedCeloAmount: BigNumber): Promise<BigNumber> => {
    const estimatedFee = new BigNumber(
      await withdraw(stakedCeloAmount).estimateGas(createTxOptions())
    );
    return estimatedFee.plus(estimatedFee.dividedBy(10));
  };

  const estimateCeloWithdrawal = async (stakedCeloAmount: BigNumber) =>
    managerContract.methods.toCelo(stakedCeloAmount.toString()).call({ from: address });

  return {
    unstake,
    estimateUnstakingFee,
    estimateCeloWithdrawal,
  };
}
