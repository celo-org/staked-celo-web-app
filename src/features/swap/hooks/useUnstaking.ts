import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import api from 'src/services/api';
import { Celo, StCelo } from 'src/utils/tokens';
import { showUnstakingToast } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { stCeloExchangeRate } = useExchangeContext();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);
  const [unstakingGasFee, setUnstakingGasFee] = useState<StCelo>(new StCelo(0));

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

  const unstake = async () => {
    if (!address || !stCeloAmount || stCeloAmount.isEqualTo(0)) return;
    await sendTransaction(withdrawTx(), createTxOptions());
    await api.withdraw(address);
    await Promise.all([loadBalances(), loadPendingWithdrawals()]);
    showUnstakingToast();
    setStCeloAmount(null);
  };

  const estimateUnstakingGas = useCallback(async () => {
    if (!stCeloAmount || stCeloAmount.isEqualTo(0) || stCeloAmount.isGreaterThan(stCeloBalance)) {
      setUnstakingGasFee(new StCelo(0));
      return;
    }
    const gasFee = new BigNumber(await withdrawTx().estimateGas(createTxOptions()));
    setUnstakingGasFee(new StCelo(gasFee.multipliedBy(GAS_PRICE)));
  }, [withdrawTx, createTxOptions, stCeloBalance, stCeloAmount]);

  const receivedCelo = new Celo(stCeloAmount ? stCeloAmount.multipliedBy(stCeloExchangeRate) : 0);

  useEffect(() => void estimateUnstakingGas(), [estimateUnstakingGas]);

  return {
    stCeloAmount,
    setStCeloAmount,
    unstake,
    unstakingGasFee,
    receivedCelo,
  };
}
