import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import api from 'src/services/api';
import { Celo, StCelo } from 'src/utils/tokens';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { stCeloExchangeRate } = useExchangeContext();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);

  const createTxOptions = useCallback(
    () => ({
      from: address!,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address]
  );

  const withdrawTx = useCallback(
    () => stCeloAmount && managerContract.methods.withdraw(stCeloAmount.toFixed()),
    [managerContract, stCeloAmount]
  );

  const unstake = useCallback(async () => {
    if (!address || !stCeloAmount || stCeloAmount.isEqualTo(0)) return;
    await sendTransaction(withdrawTx(), createTxOptions());
    await api.withdraw(address);
    await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    setStCeloAmount(null);
  }, [
    withdrawTx,
    createTxOptions,
    loadBalances,
    loadPendingWithdrawals,
    address,
    sendTransaction,
    stCeloAmount,
  ]);

  const estimateUnstakingGas = useCallback(async (): Promise<StCelo> => {
    if (!stCeloAmount || stCeloAmount.isEqualTo(0) || stCeloAmount.isGreaterThan(stCeloBalance))
      return new StCelo(0);
    const gasFee = new BigNumber(await withdrawTx().estimateGas(createTxOptions()));
    return new StCelo(gasFee.multipliedBy(GAS_PRICE));
  }, [withdrawTx, createTxOptions, stCeloBalance, stCeloAmount]);

  const receivedCelo = new Celo(stCeloAmount ? stCeloAmount.multipliedBy(stCeloExchangeRate) : 0);

  return {
    stCeloAmount,
    setStCeloAmount,
    unstake,
    stCeloExchangeRate,
    estimateUnstakingGas,
    receivedCelo,
  };
}
