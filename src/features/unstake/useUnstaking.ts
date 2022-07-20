import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { StakedCeloWei } from 'src/types/units';
import { PendingCeloWithdrawal } from './types';

export function useUnstaking() {
  const { address } = useAccount();
  const { managerContract, accountContract } = useContracts();

  const createTxOptions = () => ({
    from: address,
    gas: GAS_LIMIT,
    gasPrice: GAS_PRICE,
  });

  const withdraw = (amount: StakedCeloWei) => managerContract.methods.withdraw(amount.toString());

  const unstake = (amount: StakedCeloWei) => withdraw(amount).send(createTxOptions());

  const estimateUnstakingFee = async (amount: StakedCeloWei): Promise<StakedCeloWei> => {
    const gasFee = new StakedCeloWei(await withdraw(amount).estimateGas(createTxOptions()));
    const increasedGasFee = gasFee.plus(gasFee.dividedBy(10)).toString();
    return new StakedCeloWei(increasedGasFee);
  };

  const estimateCeloWithdrawal = (amount: StakedCeloWei) =>
    managerContract.methods.toCelo(amount.toString()).call({ from: address });

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
