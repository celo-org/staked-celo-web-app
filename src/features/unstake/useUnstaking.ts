import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { fromStCeloWei, toStCeloWei } from 'src/formatters/amount';
import { useContracts } from 'src/hooks/useContracts';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import { StCelo, StCeloWei } from 'src/types/units';

export function useUnstaking() {
  const { address, loadBalances } = useAccountContext();
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

  return {
    unstake,
    stCeloExchangeRate,
    estimateUnstakingFee,
    estimateWithdrawalValue,
  };
}
