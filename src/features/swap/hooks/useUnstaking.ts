import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useAPI } from 'src/hooks/useAPI';
import { TxCallbacks, useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, CeloUSD, StCelo } from 'src/utils/tokens';
import { showUnstakingToast } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { api } = useAPI();
  const { unstakingRate, celoToUSDRate } = useProtocolContext();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);
  const [unstakingGasFee, setUnstakingGasFee] = useState<CeloUSD>(new CeloUSD(0));

  const createTxOptions = useCallback(() => ({ from: address! }), [address]);

  const withdrawTx = useCallback(
    () => stCeloAmount && managerContract.methods.withdraw(stCeloAmount.toFixed()),
    [managerContract, stCeloAmount]
  );

  const unstake = async (callbacks?: TxCallbacks) => {
    if (!address || !stCeloAmount || stCeloAmount.isEqualTo(0)) return;
    await sendTransaction(withdrawTx(), createTxOptions(), callbacks);
    await api.withdraw(address);
    await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    showUnstakingToast();
    setStCeloAmount(null);
  };

  const estimateUnstakingGas = useCallback(async () => {
    if (!stCeloAmount || stCeloAmount.isEqualTo(0) || stCeloAmount.isGreaterThan(stCeloBalance)) {
      setUnstakingGasFee(new CeloUSD(0));
      return;
    }
    const gasFee = new BigNumber(await withdrawTx().estimateGas(createTxOptions()));
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(GAS_PRICE));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    setUnstakingGasFee(gasFeeInUSD);
  }, [withdrawTx, createTxOptions, stCeloBalance, stCeloAmount, celoToUSDRate]);

  const receivedCelo = useMemo(
    () => (stCeloAmount ? new Celo(stCeloAmount.multipliedBy(unstakingRate).dp(0)) : null),
    [stCeloAmount, unstakingRate]
  );

  useEffect(() => void estimateUnstakingGas(), [estimateUnstakingGas]);

  return {
    stCeloAmount,
    setStCeloAmount,
    unstake,
    unstakingGasFee,
    receivedCelo,
  };
}
