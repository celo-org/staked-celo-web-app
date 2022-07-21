import { useCallback } from 'react';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { useExchangeRates } from 'src/hooks/useExchangeRates';
import { CeloWei } from 'src/types/units';

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
    async (amount: CeloWei): Promise<CeloWei> => {
      const gasFee = new CeloWei(await deposit().estimateGas(createTxOptions(amount)));
      const increasedGasFee = gasFee.plus(gasFee.dividedBy(10)).toString();
      return new CeloWei(increasedGasFee);
    },
    [createTxOptions, deposit]
  );

  const estimateDepositValue = useCallback(
    (amount: number) => amount * celoExchangeRate,
    [celoExchangeRate]
  );

  return {
    stake,
    estimateStakingFee,
    estimateDepositValue,
  };
}
