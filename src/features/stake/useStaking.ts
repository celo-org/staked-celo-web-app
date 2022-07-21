import { useCallback } from 'react';
import { fromCeloWei, toCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { useExchangeRates } from 'src/hooks/useExchangeRates';
import { Celo, CeloWei } from 'src/types/units';

export function useStaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract } = useContracts();
  const { celoExchangeRate } = useExchangeRates();

  const createTxOptions = useCallback(
    (amount: CeloWei) => ({
      from: address,
      value: amount.toString(),
    }),
    [address]
  );

  const deposit = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = useCallback(
    async (amount: CeloWei) => {
      await deposit().send(createTxOptions(amount));
      await loadBalances();
    },
    [createTxOptions, deposit, loadBalances]
  );

  const estimateStakingFee = useCallback(
    async (amount: number): Promise<Celo> => {
      const celoAmount = toCeloWei(new Celo(amount));
      const gasFee = new CeloWei(await deposit().estimateGas(createTxOptions(celoAmount)));
      const adjustedGasFee = gasFee.plus(gasFee.dividedBy(10)) as CeloWei;
      return fromCeloWei(adjustedGasFee);
    },
    [createTxOptions, deposit]
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
