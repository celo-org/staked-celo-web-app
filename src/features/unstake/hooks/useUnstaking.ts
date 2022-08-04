import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import api from 'src/services/api';
import { StCeloWei } from 'src/utils/tokens';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
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

  const estimateUnstakingGas = useCallback(
    async (amount: StCeloWei): Promise<StCeloWei> => {
      if (amount.isGreaterThan(stCeloBalance)) return new StCeloWei(0);
      const gasFee = new BigNumber(await withdrawTx(amount).estimateGas(createTxOptions()));
      return new StCeloWei(gasFee.multipliedBy(GAS_PRICE));
    },
    [withdrawTx, createTxOptions, stCeloBalance]
  );

  const estimateWithdrawalValue = useCallback(
    (amount: StCeloWei) => new StCeloWei(amount.multipliedBy(stCeloExchangeRate)),
    [stCeloExchangeRate]
  );

  return {
    unstake,
    stCeloExchangeRate,
    estimateUnstakingGas,
    estimateWithdrawalValue,
  };
}
