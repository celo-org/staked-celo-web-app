import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { useAPI } from 'src/hooks/useAPI';
import logger from 'src/services/logger';
import { Mode } from 'src/types';
import { transactionEvent } from 'src/utils/ga';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import type { Address } from 'viem';
import { usePublicClient, useWriteContract } from 'wagmi';
import { showErrorToast, showHashToast, showStakingToast } from '../utils/toast';

export function useStaking() {
  const { address, loadBalances, celoBalance, stCeloBalance } = useAccountContext();
  const { managerContract } = useBlockchain();
  const { api } = useAPI();
  const { stakingRate, celoToUSDRate } = useProtocolContext();
  const { suggestedGasPrice } = useGasPrices();
  const [celoAmount, setCeloAmount] = useState<Celo | null>(null);
  const publicClient = usePublicClient();

  const { writeContractAsync: _stake } = useWriteContract();

  const _estimateDepositGas = useCallback(
    (address: Address, value: bigint) => {
      return publicClient!.estimateContractGas({
        abi: managerContract.abi,
        address: managerContract.address!,
        account: address!,
        functionName: 'deposit',
        value,
      });
    },
    [publicClient, managerContract]
  );

  const stake = useCallback(
    async (callbacks?: TxCallbacks) => {
      if (!address || !celoAmount || celoAmount.isEqualTo(0) || !stCeloBalance || !loadBalances) {
        return;
      }

      const preDepositStTokenBalance = stCeloBalance.toString();
      transactionEvent({
        action: Mode.stake,
        status: 'initiated_transaction',
        value: celoAmount.displayAsBase(),
      });
      try {
        const value = celoAmount?.toBigInt();
        const gas = await _estimateDepositGas(address!, value);
        const stakeHash = await _stake({
          address: managerContract.address!,
          abi: managerContract.abi,
          functionName: 'deposit',
          value,
          gas,
        });
        console.info('stakeHash', stakeHash);
        transactionEvent({
          action: Mode.stake,
          status: 'signed_transaction',
          value: celoAmount.displayAsBase(),
        });
        showHashToast(stakeHash);
        callbacks?.onSent?.();
        // Must wait for reciept or balances will not have changed yet
        const receipt = await publicClient!.waitForTransactionReceipt({
          hash: stakeHash,
          pollingInterval: 500,
        });
        console.info('stake receipt', receipt);
        const [{ data: _celoBalance }, { data: _stCeloBalance }] = await loadBalances();
        const postDepositStTokenBalance = new StCelo(_stCeloBalance);
        const receivedStCelo = new StCelo(
          postDepositStTokenBalance.minus(preDepositStTokenBalance)
        );
        showStakingToast(receivedStCelo);
        console.info('new CELO balance', _celoBalance);
        setCeloAmount(null);
      } catch (e: unknown) {
        console.error(e);
        showErrorToast(
          (e as Error).message.includes('rejected') ||
            (e as any).details?.toLowerCase().includes('cancelled')
            ? 'User rejected the request'
            : (e as Error).message
        );
        callbacks?.onSent?.();
      }
      try {
        // eslint-disable-next-line no-console
        console.info('afterDeposit');
        await api.afterDeposit();
      } catch (e) {
        logger.error('afterDeposit error', e);
      }
    },
    [
      _estimateDepositGas,
      _stake,
      address,
      api,
      celoAmount,
      publicClient,
      loadBalances,
      stCeloBalance,
    ]
  );

  const estimateStakingGas = useCallback(async () => {
    if (
      !celoAmount ||
      celoAmount.isEqualTo(0) ||
      celoAmount.isGreaterThan(celoBalance) ||
      !address ||
      !managerContract.address
    ) {
      return null;
    }

    const gasFee = new Token(await _estimateDepositGas(address!, celoAmount.toBigInt()));
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [
    celoAmount,
    celoBalance,
    address,
    managerContract.address,
    _estimateDepositGas,
    suggestedGasPrice,
    celoToUSDRate,
  ]);

  const receivedStCelo = useMemo(
    () => (celoAmount ? new StCelo(celoAmount.multipliedBy(stakingRate).dp(0)) : null),
    [celoAmount, stakingRate]
  );

  return {
    celoAmount,
    setCeloAmount,
    stake,
    estimateStakingGas,
    receivedStCelo,
  };
}
