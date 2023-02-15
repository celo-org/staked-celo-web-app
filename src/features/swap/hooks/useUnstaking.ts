import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useAPI } from 'src/hooks/useAPI';
import { TxCallbacks, useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, CeloUSD, StCelo } from 'src/utils/tokens';
import { transactionEvent } from '../../../utils/ga';
import { showUnstakingToast } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { api } = useAPI();
  const { unstakingRate, celoToUSDRate, suggestedGasPrice } = useProtocolContext();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);

  const createTxOptions = useCallback(() => {
    if (!address) throw new Error('Cannot create tx options without an address');
    return { from: address, gasPrice: suggestedGasPrice };
  }, [address, suggestedGasPrice]);

  const withdrawTx = useCallback(
    () => stCeloAmount && managerContract.methods.withdraw(stCeloAmount.toFixed()),
    [managerContract, stCeloAmount]
  );

  const unstake = async (callbacks?: TxCallbacks) => {
    if (!address || !stCeloAmount || stCeloAmount.isEqualTo(0)) return;
    transactionEvent({
      action: 'unstake',
      status: 'initiated_transaction',
      value: stCeloAmount.displayAsBase(),
    });
    await sendTransaction(withdrawTx(), createTxOptions(), callbacks);
    transactionEvent({
      action: 'unstake',
      status: 'signed_transaction',
      value: stCeloAmount.displayAsBase(),
    });
    api.withdraw(address);
    await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    showUnstakingToast();
    setStCeloAmount(null);
  };

  const estimateUnstakingGas = useCallback(async () => {
    if (!stCeloAmount || stCeloAmount.isEqualTo(0) || stCeloAmount.isGreaterThan(stCeloBalance)) {
      return null;
    }
    const gasFee = new BigNumber(await withdrawTx().estimateGas(createTxOptions()));
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [withdrawTx, createTxOptions, stCeloBalance, stCeloAmount, celoToUSDRate, suggestedGasPrice]);

  const receivedCelo = useMemo(
    () => (stCeloAmount ? new Celo(stCeloAmount.multipliedBy(unstakingRate).dp(0)) : null),
    [stCeloAmount, unstakingRate]
  );

  return {
    stCeloAmount,
    setStCeloAmount,
    unstake,
    estimateUnstakingGas,
    receivedCelo,
  };
}
