import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { fromStCeloWei, toStCeloWei } from 'src/formatters/amount';
import { useContracts } from 'src/hooks/useContracts';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import api from 'src/services/api';
import { StCelo, StCeloWei } from 'src/types/units';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals } = useAccountContext();
  const { managerContract } = useContracts();
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
      if (!address) return;
      await withdrawTx(amount).send(createTxOptions());
      await api.withdraw(address);
      await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    },
    [withdrawTx, createTxOptions, loadBalances, loadPendingWithdrawals, address]
  );

  const estimateUnstakingFee = useCallback(
    async (amount: number): Promise<StCelo> => {
      const stCeloWeiAmount = toStCeloWei(new StCelo(amount));
      const gasFee = new BigNumber(
        await withdrawTx(stCeloWeiAmount).estimateGas(createTxOptions())
      );
      const gasFeeInStWei = new StCeloWei(gasFee.multipliedBy(GAS_PRICE).toFixed());
      return fromStCeloWei(gasFeeInStWei);
    },
    [withdrawTx, createTxOptions]
  );

  const estimateWithdrawalValue = useCallback(
    (amount: number) => amount * stCeloExchangeRate,
    [stCeloExchangeRate]
  );

  return {
    unstake,
    stCeloExchangeRate,
    estimateUnstakingFee,
    estimateWithdrawalValue,
  };
}
