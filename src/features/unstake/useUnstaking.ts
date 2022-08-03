import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import api from 'src/services/api';
import { fromStCeloWei, StCelo, StCeloWei, toStCeloWei } from 'src/utils/tokens';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { stCeloExchangeRate } = useExchangeContext();

  const createTxOptions = useCallback(
    () => ({
      from: address!,
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
      await sendTransaction(withdrawTx(amount), createTxOptions());
      await api.withdraw(address);
      await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    },
    [withdrawTx, createTxOptions, loadBalances, loadPendingWithdrawals, address, sendTransaction]
  );

  const estimateUnstakingFee = useCallback(
    async (amount: number): Promise<StCelo> => {
      const stCeloWeiAmount = toStCeloWei(new StCelo(amount));
      const gasFee = new BigNumber(
        await withdrawTx(stCeloWeiAmount).estimateGas(createTxOptions())
      );
      const gasFeeInStWei = new StCeloWei(gasFee.multipliedBy(GAS_PRICE));
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
