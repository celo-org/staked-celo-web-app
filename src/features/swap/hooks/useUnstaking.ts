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
import { showErrorToast, showUnstakingToast } from '../utils/toast';

export function useUnstaking() {
  const { address, loadBalances, loadPendingWithdrawals, stCeloBalance } = useAccountContext();
  const { managerContract } = useBlockchain();
  const { api } = useAPI();
  const { unstakingRate, celoToUSDRate } = useProtocolContext();
  const { suggestedGasPrice } = useGasPrices();
  const [stCeloAmount, setStCeloAmount] = useState<StCelo | null>(null);
  const publicClient = usePublicClient();

  const { writeContractAsync: _unstake } = useWriteContract();

  const _estimateWithdrawGas = useCallback(
    (address: Address, value: bigint) => {
      return publicClient!.estimateContractGas({
        abi: managerContract.abi,
        address: managerContract.address!,
        account: address,
        functionName: 'withdraw',
        args: [value || 0n] as const,
      });
    },
    [publicClient, managerContract]
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
          abi: managerContract.abi,
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
        showErrorToast(
          (e as Error).message.includes('rejected') ||
            (e as any).details?.toLowerCase().includes('cancelled')
            ? 'User rejected the request'
            : (e as Error).message
        );
      } finally {
        callbacks?.onSent?.();
      }
    },
    [
      _estimateWithdrawGas,
      _unstake,
      address,
      api,
      loadBalances,
      loadPendingWithdrawals,
      managerContract,
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
    estimateUnstakingGas,
    receivedCelo,
  };
}
