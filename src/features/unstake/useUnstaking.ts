import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { useExchangeRates } from 'src/hooks/useExchangeRates';
import { StCeloWei } from 'src/types/units';
import { PendingCeloWithdrawal } from './types';

export function useUnstaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract, accountContract } = useContracts();
  const { stCeloExchangeRate } = useExchangeRates();

  const createTxOptions = useCallback(
    () => ({
      from: address,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address]
  );

  const withdrawTx = useCallback(
    (amount: StCeloWei) => managerContract.methods.withdraw(amount.toString()),
    [managerContract]
  );

  const unstake = useCallback(
    async (amount: StCeloWei) => {
      await withdrawTx(amount).send(createTxOptions());
      await loadBalances();
    },
    [withdrawTx, createTxOptions, loadBalances]
  );

  const estimateUnstakingFee = useCallback(
    async (amount: StCeloWei): Promise<StCeloWei> => {
      const gasFee = new StCeloWei(await withdrawTx(amount).estimateGas(createTxOptions()));
      const increasedGasFee = gasFee.plus(gasFee.dividedBy(10)).toString();
      return new StCeloWei(increasedGasFee);
    },
    [withdrawTx, createTxOptions]
  );

  const estimateWithdrawalValue = useCallback(
    (amount: number) => amount * stCeloExchangeRate,
    [stCeloExchangeRate]
  );

  const getPendingCeloWithdrawals = useCallback(async (): Promise<PendingCeloWithdrawal[]> => {
    const { values = [], timestamps = [] } =
      (await accountContract.methods.getPendingWithdrawals(address).call({ from: address })) || {};

    return values.map((value: string, index: number) => ({
      value,
      timestamp: timestamps[index],
    }));
  }, [accountContract, address]);

  return {
    unstake,
    estimateUnstakingFee,
    estimateWithdrawalValue,
    getPendingCeloWithdrawals,
  };
}
