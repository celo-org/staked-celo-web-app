import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import api from 'src/services/api';
import { CeloWei, StCeloWei, Wei } from 'src/utils/tokens';

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
    (amount: StCeloWei) => managerContract.methods.withdraw(amount.toFixed()),
    [managerContract]
  );

  const unstake = useCallback(async () => {
    if (!address || !stCeloWeiAmount || stCeloWeiAmount.isEqualTo(0)) return;
    await sendTransaction(withdrawTx(stCeloWeiAmount), createTxOptions());
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

  const estimateUnstakingGas = useCallback(
    async (amount: Wei): Promise<StCeloWei> => {
      if (amount.isGreaterThan(stCeloBalance)) return new StCeloWei(0);
      const gasFee = new BigNumber(
        await withdrawTx(new StCeloWei(amount)).estimateGas(createTxOptions())
      );
      return new StCeloWei(gasFee.multipliedBy(GAS_PRICE));
    },
    [withdrawTx, createTxOptions, stCeloBalance]
  );

  const estimateWithdrawalValue = useCallback(
    (amount: Wei | null) => new CeloWei(amount ? amount.multipliedBy(stCeloExchangeRate) : 0),
    [stCeloExchangeRate]
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
