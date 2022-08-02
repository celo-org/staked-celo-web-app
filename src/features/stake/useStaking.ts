import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useContracts } from 'src/hooks/useContracts';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import { Celo, CeloWei, StCelo, StCeloWei } from 'src/types/units';
import { fromCeloWei, fromStCeloWei, toCeloWei } from 'src/utils/tokens';

export function useStaking() {
  const { address, loadBalances } = useAccountContext();
  const { managerContract, stCeloContract } = useContracts();
  const { celoExchangeRate } = useExchangeContext();

  const createTxOptions = useCallback(
    (amount: CeloWei) => ({
      from: address,
      value: amount.toFixed(),
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address]
  );

  const depositTx = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = useCallback(
    async (amount: CeloWei): Promise<StCelo> => {
      const preDepositStWeiBalance = new StCeloWei(
        await stCeloContract.methods.balanceOf(address).call()
      );
      await depositTx().send(createTxOptions(amount));
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
      const gasFee = new BigNumber(await depositTx().estimateGas(createTxOptions(celoAmount)));
      const gasFeeInWei = new CeloWei(gasFee.multipliedBy(GAS_PRICE).toFixed());
      return fromCeloWei(gasFeeInWei);
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
