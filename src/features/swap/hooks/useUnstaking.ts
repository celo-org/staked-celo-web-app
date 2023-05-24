import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { useAPI } from 'src/hooks/useAPI';
import { Mode } from 'src/types';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { useContractWrite, usePublicClient } from 'wagmi';
import { transactionEvent } from '../../../utils/ga';
import { showUnstakingToast } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract } = useBlockchain();
  const { api } = useAPI();
  const { unstakingRate, celoToUSDRate } = useProtocolContext();
  const { suggestedGasPrice } = useGasPrices();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);
  const publicClient = usePublicClient();

  const params = {
    functionName: 'withdraw',
    args: [stCeloAmount?.toBigInt() || 0n] as const,
  } as const;

  const { writeAsync: _unstake } = useContractWrite({
    ...managerContract,
    ...params,
  });

  const unstake = useCallback(
    async (callbacks?: TxCallbacks) => {
      if (
        !address ||
        !stCeloAmount ||
        stCeloAmount.isEqualTo(0) ||
        !managerContract ||
        !loadBalances
      )
        return;

      transactionEvent({
        action: Mode.unstake,
        status: 'signed_transaction',
        value: stCeloAmount.displayAsBase(),
      });
      await _unstake();
      await api.withdraw(address);
      callbacks?.onSent?.();
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
      publicClient,
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
      await publicClient.estimateContractGas({
        abi: managerContract.abi,
        address: managerContract.address!,
        account: address!,
        ...params,
      })
    );
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [
    stCeloAmount,
    stCeloBalance,
    managerContract,
    publicClient,
    suggestedGasPrice,
    celoToUSDRate,
  ]);

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
