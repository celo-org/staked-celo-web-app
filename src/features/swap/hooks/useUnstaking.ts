import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useAPI } from 'src/hooks/useAPI';
import { Mode } from 'src/types';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { transactionEvent } from '../../../utils/ga';
import { showUnstakingToast } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract, sendTransaction } = useBlockchain();
  const { api } = useAPI();
  const { unstakingRate, celoToUSDRate, suggestedGasPrice } = useProtocolContext();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);

  const unstake = useCallback(
    async (callbacks?: TxCallbacks) => {
      if (!address || !stCeloAmount || stCeloAmount.isEqualTo(0) || !managerContract) return;

      const { request } = await managerContract.contract.simulate.withdraw({
        account: address,
        args: [stCeloAmount.toFixed()],
      });
      transactionEvent({
        action: Mode.unstake,
        status: 'initiated_transaction',
        value: stCeloAmount.displayAsBase(),
      });
      await sendTransaction(request, callbacks);
      transactionEvent({
        action: Mode.unstake,
        status: 'signed_transaction',
        value: stCeloAmount.displayAsBase(),
      });
      await api.withdraw(address);
      showUnstakingToast();
      await Promise.all([loadBalances(), loadPendingWithdrawals()]);
      setStCeloAmount(null);
    },
    [
      address,
      api,
      loadBalances,
      loadPendingWithdrawals,
      managerContract,
      sendTransaction,
      stCeloAmount,
    ]
  );

  const estimateUnstakingGas = useCallback(async () => {
    if (
      !stCeloAmount ||
      stCeloAmount.isEqualTo(0) ||
      stCeloAmount.isGreaterThan(stCeloBalance) ||
      !managerContract
    ) {
      return null;
    }
    const gasFee = new Token(
      await managerContract.contract.estimateGas.withdraw({
        account: address,
        args: [stCeloAmount.toFixed()],
      })
    );
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [stCeloAmount, stCeloBalance, managerContract, address, suggestedGasPrice, celoToUSDRate]);

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
