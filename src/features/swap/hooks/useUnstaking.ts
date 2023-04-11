import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useAPI } from 'src/hooks/useAPI';
import { Mode } from 'src/types';
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
    () => stCeloAmount && managerContract?.methods.withdraw(stCeloAmount.toFixed()),
    [managerContract, stCeloAmount]
  );

  const unstake = async (callbacks?: TxCallbacks) => {
    const withdrawalTXObj = withdrawTx();
    if (!address || !withdrawalTXObj || !stCeloAmount || stCeloAmount.isEqualTo(0)) return;
    transactionEvent({
      action: Mode.unstake,
      status: 'initiated_transaction',
      value: stCeloAmount.displayAsBase(),
    });
    await sendTransaction(withdrawalTXObj, createTxOptions(), callbacks);
    transactionEvent({
      action: Mode.unstake,
      status: 'signed_transaction',
      value: stCeloAmount.displayAsBase(),
    });
    await api.withdraw(address);
    showUnstakingToast();
    await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    setStCeloAmount(null);
  };

  const estimateUnstakingGas = useCallback(async () => {
    const withdrawalTXObj = withdrawTx();
    if (
      !stCeloAmount ||
      !withdrawalTXObj ||
      stCeloAmount.isEqualTo(0) ||
      stCeloAmount.isGreaterThan(stCeloBalance)
    ) {
      return null;
    }
    const gasFee = new BigNumber(await withdrawalTXObj.estimateGas(createTxOptions()));
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
