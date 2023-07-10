import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { useAPI } from 'src/hooks/useAPI';
import { Mode } from 'src/types';
import { transactionEvent } from 'src/utils/ga';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { useContractWrite, usePublicClient } from 'wagmi';
import { showErrorToast, showStakingToast } from '../utils/toast';

export function useStaking() {
  const { address, loadBalances, celoBalance, stCeloBalance } = useAccountContext();
  const { managerContract } = useBlockchain();
  const { api } = useAPI();
  const { stakingRate, celoToUSDRate } = useProtocolContext();
  const { suggestedGasPrice } = useGasPrices();
  const [celoAmount, setCeloAmount] = useState<Celo | null>(null);
  const publicClient = usePublicClient();

  const { writeAsync: _stake } = useContractWrite({
    ...managerContract,
    functionName: 'deposit',
    value: 0n,
  });

  const stake = useCallback(
    async (callbacks?: TxCallbacks) => {
      if (!address || !celoAmount || celoAmount.isEqualTo(0) || !stCeloBalance || !loadBalances) {
        return;
      }

      const preDepositStTokenBalance = stCeloBalance!;
      transactionEvent({
        action: Mode.stake,
        status: 'initiated_transaction',
        value: celoAmount.displayAsBase(),
      });
      try {
        await _stake({ value: celoAmount?.toBigInt() });
        transactionEvent({
          action: Mode.stake,
          status: 'signed_transaction',
          value: celoAmount.displayAsBase(),
        });
        await api.activate();
        const [{ data: _celoBalance }, { data: _stCeloBalance }] = await loadBalances();
        const postDepositStTokenBalance = new StCelo(_stCeloBalance);
        const receivedStCelo = new StCelo(
          postDepositStTokenBalance.minus(preDepositStTokenBalance)
        );
        showStakingToast(receivedStCelo);
        setCeloAmount(null);
      } catch (e: unknown) {
        console.error(e);
        showErrorToast(
          (e as Error).message.includes('rejected')
            ? 'User rejected the request'
            : (e as Error).message
        );
      } finally {
        callbacks?.onSent?.();
      }
    },
    [address, api, celoAmount, loadBalances, publicClient, stCeloBalance]
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

    const gasFee = new Token(
      await publicClient.estimateContractGas({
        abi: managerContract.abi,
        address: managerContract.address!,
        account: address!,
        functionName: 'deposit',
        value: celoAmount.toBigInt(),
      })
    );
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [celoAmount, celoBalance, managerContract, publicClient, suggestedGasPrice, celoToUSDRate]);

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
