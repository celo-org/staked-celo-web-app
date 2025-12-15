import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { useAPI } from 'src/hooks/useAPI';
import logger from 'src/services/logger';
import { Mode } from 'src/types';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import type { Address } from 'viem';
import { usePublicClient, useWriteContract } from 'wagmi';
import { transactionEvent } from '../../../utils/ga';
import { showErrorToast, showUnstakingToast, getUserFriendlyErrorMessage } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const {
    accountContract,
    managerContract,
    stakedCeloContract,
    specificGroupStrategyContract,
    defaultGroupStrategyContract,
  } = useBlockchain();
  const { api } = useAPI();
  const { unstakingRate, celoToUSDRate } = useProtocolContext();
  const { suggestedGasPrice } = useGasPrices();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);
  const publicClient = usePublicClient();
  const allAbis = useMemo(
    () => [
      ...stakedCeloContract.abi,
      ...specificGroupStrategyContract.abi,
      ...defaultGroupStrategyContract.abi,
      ...accountContract.abi,
      ...managerContract.abi,
    ],
    [
      accountContract.abi,
      managerContract.abi,
      stakedCeloContract.abi,
      specificGroupStrategyContract.abi,
      defaultGroupStrategyContract.abi,
    ]
  );
  const { writeContractAsync: _unstake } = useWriteContract();

  const _estimateWithdrawGas = useCallback(
    async (address: Address, value: bigint) => {
      return publicClient!.estimateContractGas({
        // errors might come from any contract the manager calls
        abi: allAbis,
        address: managerContract.address!,
        account: address,
        functionName: 'withdraw',
        args: [value || 0n] as const,
      });
    },
    [publicClient, allAbis, managerContract.address]
  );

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
      try {
        const gas = await _estimateWithdrawGas(address, stCeloAmount?.toBigInt());
        await _unstake({
          address: managerContract.address!,
          // errors might come from any contract the manager calls
          abi: allAbis,
          functionName: 'withdraw',
          args: [stCeloAmount?.toBigInt() || 0n] as const,
          gas,
        });
        await api.withdraw(address);
        showUnstakingToast();
        await Promise.all([loadBalances(), loadPendingWithdrawals?.()]);
        setStCeloAmount(null);
      } catch (e: unknown) {
        logger.error(e);
        showErrorToast(getUserFriendlyErrorMessage(e));
      } finally {
        callbacks?.onSent?.();
      }
    },
    [
      address,
      stCeloAmount,
      managerContract,
      loadBalances,
      _estimateWithdrawGas,
      _unstake,
      allAbis,
      api,
      loadPendingWithdrawals,
    ]
  );

  const estimateUnstakingGasInUSD = useCallback(async () => {
    if (
      !stCeloAmount ||
      stCeloAmount.isEqualTo(0) ||
      stCeloAmount.isGreaterThan(stCeloBalance) ||
      !managerContract
    ) {
      return null;
    }

    const gasFee = new Token(await _estimateWithdrawGas(address!, stCeloAmount?.toBigInt()));
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [
    stCeloAmount,
    stCeloBalance,
    managerContract,
    _estimateWithdrawGas,
    address,
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
    estimateUnstakingGasInUSD,
    receivedCelo,
  };
}
