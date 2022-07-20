import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { StCeloWei } from 'src/types/units';
import { PendingCeloWithdrawal } from './types';

export function useUnstaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract, accountContract } = useContracts();

  const createTxOptions = () => ({
    from: address,
    gas: GAS_LIMIT,
    gasPrice: GAS_PRICE,
  });

  const withdrawTx = (amount: StCeloWei) => managerContract.methods.withdraw(amount.toString());

  const unstake = async (amount: StCeloWei) => {
    await withdrawTx(amount).send(createTxOptions());
    await loadBalances();
  };

  const estimateUnstakingFee = async (amount: StCeloWei): Promise<StCeloWei> => {
    const gasFee = new StCeloWei(await withdrawTx(amount).estimateGas(createTxOptions()));
    const increasedGasFee = gasFee.plus(gasFee.dividedBy(10)).toString();
    return new StCeloWei(increasedGasFee);
  };

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
    getPendingCeloWithdrawals,
  };
}
