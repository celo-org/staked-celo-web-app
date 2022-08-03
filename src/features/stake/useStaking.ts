import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import {
  Celo,
  CeloWei,
  fromCeloWei,
  fromStCeloWei,
  StCelo,
  StCeloWei,
  toCeloWei,
} from 'src/utils/tokens';

export function useStaking() {
  const { address, loadBalances } = useAccountContext();
  const { managerContract, stCeloContract, sendTransaction } = useBlockchain();
  const { celoExchangeRate } = useExchangeContext();

  const createTxOptions = useCallback(
    (amount: CeloWei) => ({
      from: address!,
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
      await sendTransaction(depositTx(), createTxOptions(amount));
      await loadBalances();
      const postDepositStWeiBalance = new StCeloWei(
        await stCeloContract.methods.balanceOf(address).call()
      );
      const receivedStCeloWei = postDepositStWeiBalance.minus(preDepositStWeiBalance);
      return fromStCeloWei(receivedStCeloWei as StCeloWei);
    },
    [createTxOptions, depositTx, loadBalances, stCeloContract, address, sendTransaction]
  );

  const estimateStakingFee = useCallback(
    async (amount: number): Promise<Celo> => {
      const celoAmount = toCeloWei(new Celo(amount));
      const gasFee = new BigNumber(await depositTx().estimateGas(createTxOptions(celoAmount)));
      const gasFeeInWei = new CeloWei(gasFee.multipliedBy(GAS_PRICE));
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
