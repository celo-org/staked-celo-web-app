import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import toast from 'src/services/toast';
import { CeloWei, StCeloWei, Wei } from 'src/utils/tokens';

export function useStaking() {
  const { address, loadBalances, celoBalance } = useAccountContext();
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
    async (amount: Wei) => {
      const preDepositStWeiBalance = new StCeloWei(
        await stCeloContract.methods.balanceOf(address).call()
      );
      await sendTransaction(depositTx(), createTxOptions(new CeloWei(amount)));
      await loadBalances();
      const postDepositStWeiBalance = new StCeloWei(
        await stCeloContract.methods.balanceOf(address).call()
      );
      const receivedStWei = new StCeloWei(postDepositStWeiBalance.minus(preDepositStWeiBalance));
      toast.stakingSuccess(receivedStWei);
    },
    [createTxOptions, depositTx, loadBalances, stCeloContract, address, sendTransaction]
  );

  const estimateStakingGas = useCallback(
    async (amount: Wei): Promise<CeloWei> => {
      if (amount.isGreaterThan(celoBalance)) return new CeloWei(0);
      const gasFee = new BigNumber(
        await depositTx().estimateGas(createTxOptions(new CeloWei(amount)))
      );
      return new CeloWei(gasFee.multipliedBy(GAS_PRICE));
    },
    [createTxOptions, depositTx, celoBalance]
  );

  const estimateDepositValue = useCallback(
    (amount: Wei) => new StCeloWei(amount.multipliedBy(celoExchangeRate)),
    [celoExchangeRate]
  );

  return {
    stake,
    celoExchangeRate,
    estimateStakingGas,
    estimateDepositValue,
  };
}
