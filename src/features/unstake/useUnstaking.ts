import { useCallback, useEffect, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { fromStCeloWei, toStCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import { Celo, StCelo, StCeloWei } from 'src/types/units';
import { PendingWithdrawal } from './types';

export function useUnstaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract, accountContract } = useContracts();
  const { stCeloExchangeRate } = useExchangeContext();

  const createTxOptions = useCallback(
    () => ({
      from: address,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address]
  );

  const withdrawTx = useCallback(
    (amount: StCeloWei) => managerContract.methods.withdraw(amount.toFixed()),
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
    async (amount: number): Promise<StCelo> => {
      const stCeloWeiAmount = toStCeloWei(new StCelo(amount));
      const gasFee = new StCeloWei(
        await withdrawTx(stCeloWeiAmount).estimateGas(createTxOptions())
      );
      const increasedGasFee = gasFee.plus(gasFee.dividedBy(10)) as StCeloWei;
      return fromStCeloWei(increasedGasFee);
    },
    [withdrawTx, createTxOptions]
  );

  const estimateWithdrawalValue = useCallback(
    (amount: number) => amount * stCeloExchangeRate,
    [stCeloExchangeRate]
  );

  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);
  const loadPendingWithdrawals = useCallback(async () => {
    const { values = [], timestamps = [] } =
      (await accountContract.methods.getPendingWithdrawals(address).call({ from: address })) || {};

    setPendingWithdrawals(
      values.map((amount: string, index: number) => ({
        amount: new Celo(amount),
        timestamp: timestamps[index],
      }))
    );
  }, [accountContract, address]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadPendingWithdrawals();
  }, [loadPendingWithdrawals]);

  return {
    unstake,
    stCeloExchangeRate,
    estimateUnstakingFee,
    estimateWithdrawalValue,
    pendingWithdrawals,
    loadPendingWithdrawals,
  };
}
