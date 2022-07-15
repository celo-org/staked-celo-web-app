import BigNumber from 'bignumber.js';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { PendingCeloWithdrawal } from './types';

export function useUnstaking() {
  const { address } = useAccount();
  const { managerContract, accountContract } = useContracts();

  const createTxOptions = () => ({
    from: address,
    gas: GAS_LIMIT,
    gasPrice: GAS_PRICE,
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

  const getPendingCeloWithdrawals = async (): Promise<PendingCeloWithdrawal[]> => {
    const { values = [], timestamps = [] } =
      (await accountContract.methods.getPendingWithdrawals(address).call({ from: address })) || {};

    return values.map((value: string, index: number) => ({
      value,
      timestamp: timestamps[index],
    }));
  };

  return {
    unstake,
    estimateUnstakingFee,
    estimateCeloWithdrawal,
    getPendingCeloWithdrawals,
  };
}
