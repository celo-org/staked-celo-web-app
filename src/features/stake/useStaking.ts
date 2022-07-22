import { useCallback } from 'react';
import { fromCeloWei, toCeloWei } from 'src/formatters/amount';
import { useContracts } from 'src/hooks/useContracts';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import { Celo, CeloWei } from 'src/types/units';

export function useStaking() {
  const { address, loadBalances } = useAccountContext();
  const { managerContract } = useContracts();
  const { celoExchangeRate } = useExchangeContext();

  const createTxOptions = useCallback(
    (amount: CeloWei) => ({
      from: address,
      value: amount.toFixed(),
    }),
    [address]
  );

  const depositTx = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = useCallback(
    async (amount: CeloWei) => {
      await depositTx().send(createTxOptions(amount));
      await loadBalances();
    },
    [createTxOptions, depositTx, loadBalances]
  );

  const estimateStakingFee = useCallback(
    async (amount: number): Promise<Celo> => {
      const celoAmount = toCeloWei(new Celo(amount));
      const gasFee = new CeloWei(await depositTx().estimateGas(createTxOptions(celoAmount)));
      const adjustedGasFee = gasFee.plus(gasFee.dividedBy(10)) as CeloWei;
      return fromCeloWei(adjustedGasFee);
    },
    [createTxOptions, depositTx]
  );

  const estimateDepositValue = useCallback(
    (amount: number) => amount * celoExchangeRate,
    [celoExchangeRate]
  );

  return {
    stake,
    celoExchangeRate,
    estimateStakingFee,
    estimateDepositValue,
  };
}
