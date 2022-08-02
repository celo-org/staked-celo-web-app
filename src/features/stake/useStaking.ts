import { useCallback } from 'react';
import { fromCeloWei, fromStCeloWei, toCeloWei } from 'src/formatters/amount';
import { useContracts } from 'src/hooks/useContracts';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import { Celo, CeloWei, StCelo, StCeloWei } from 'src/types/units';
import { useCelo } from '@celo/react-celo';

export function useStaking() {
  const { address, loadBalances } = useAccountContext();
  const { managerContract, stCeloContract } = useContracts();
  const { celoExchangeRate } = useExchangeContext();
  const { kit } = useCelo();

  const createTxOptions = useCallback(
    (amount: CeloWei) => ({
      from: address!,
      value: amount.toFixed(),
    }),
    [address]
  );

  const depositTx = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = useCallback(
    async (amount: CeloWei): Promise<StCelo> => {
      const preDepositStWeiBalance = new StCeloWei(
        await stCeloContract.methods.balanceOf(address).call()
      );

      const tx = await kit.connection.sendTransactionObject(depositTx(), createTxOptions(amount))
      const receipt = await tx.waitReceipt()
      console.log(receipt)

      await loadBalances();
      const postDepositStWeiBalance = new StCeloWei(
        await stCeloContract.methods.balanceOf(address).call()
      );
      const receivedStCeloWei = postDepositStWeiBalance.minus(preDepositStWeiBalance);
      return fromStCeloWei(receivedStCeloWei as StCeloWei);
    },
    [createTxOptions, depositTx, loadBalances, stCeloContract, address]
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
