import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import api from 'src/services/api';
import { CeloWei, StCeloWei } from 'src/utils/tokens';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { stCeloExchangeRate } = useExchangeContext();
  const [stCeloWeiAmount, setStCeloWeiAmount] = useState<StCeloWei | null>(null);

  const createTxOptions = useCallback(
    () => ({
      from: address!,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address]
  );

  const withdrawTx = useCallback(
    () => stCeloWeiAmount && managerContract.methods.withdraw(stCeloWeiAmount.toFixed()),
    [managerContract, stCeloWeiAmount]
  );

  const unstake = useCallback(async () => {
    if (!address || !stCeloWeiAmount || stCeloWeiAmount.isEqualTo(0)) return;
    await sendTransaction(withdrawTx(), createTxOptions());
    await api.withdraw(address);
    await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    setStCeloWeiAmount(null);
  }, [
    withdrawTx,
    createTxOptions,
    loadBalances,
    loadPendingWithdrawals,
    address,
    sendTransaction,
    stCeloWeiAmount,
  ]);

  const estimateUnstakingGas = useCallback(async (): Promise<StCeloWei> => {
    if (!stCeloWeiAmount || stCeloWeiAmount.isGreaterThan(stCeloBalance)) return new StCeloWei(0);
    const gasFee = new BigNumber(await withdrawTx().estimateGas(createTxOptions()));
    return new StCeloWei(gasFee.multipliedBy(GAS_PRICE));
  }, [withdrawTx, createTxOptions, stCeloBalance, stCeloWeiAmount]);

  const estimateWithdrawalValue = useCallback(
    () => new CeloWei(stCeloWeiAmount ? stCeloWeiAmount.multipliedBy(stCeloExchangeRate) : 0),
    [stCeloExchangeRate, stCeloWeiAmount]
  );

  return {
    stCeloWeiAmount,
    setStCeloWeiAmount,
    unstake,
    stCeloExchangeRate,
    estimateUnstakingGas,
    estimateWithdrawalValue,
  };
}
