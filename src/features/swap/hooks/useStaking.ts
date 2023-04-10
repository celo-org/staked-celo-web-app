import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useAPI } from 'src/hooks/useAPI';
import { Mode } from 'src/types';
import { Celo, CeloUSD, StCelo } from 'src/utils/tokens';
import { transactionEvent } from 'src/utils/ga';
import { showStakingToast } from '../utils/toast';

export function useStaking() {
  const { address, loadBalances, celoBalance } = useAccountContext();
  const { managerContract, stCeloContract, sendTransaction } = useBlockchain();
  const { api } = useAPI();
  const { stakingRate, celoToUSDRate, suggestedGasPrice } = useProtocolContext();
  const [celoAmount, setCeloAmount] = useState<Celo | null>(null);

  const createTxOptions = useCallback(() => {
    if (!address) throw new Error('Cannot create tx options without an address');
    return { from: address, value: celoAmount?.toFixed(), gasPrice: suggestedGasPrice };
  }, [address, celoAmount, suggestedGasPrice]);

  const depositTx = useCallback(() => managerContract?.methods?.deposit(), [managerContract]);

  const stake = async (callbacks?: TxCallbacks) => {
    if (!address || !managerContract || !stCeloContract || !celoAmount || celoAmount.isEqualTo(0)) return;
    const preDepositStTokenBalance = new StCelo(
      await stCeloContract.methods.balanceOf(address).call()
    );
    transactionEvent({
      action: Mode.stake,
      status: 'initiated_transaction',
      value: celoAmount.displayAsBase(),
    });
    await sendTransaction(depositTx(), createTxOptions(), callbacks);
    transactionEvent({
      action: Mode.stake,
      status: 'signed_transaction',
      value: celoAmount.displayAsBase(),
    });
    void api.activate(); // TODO: should this be awaited? added void to shut linter.
    await loadBalances();
    const postDepositStTokenBalance = new StCelo(
      await stCeloContract.methods.balanceOf(address).call()
    );
    const receivedStCelo = new StCelo(postDepositStTokenBalance.minus(preDepositStTokenBalance));
    showStakingToast(receivedStCelo);
    setCeloAmount(null);
  };

  const estimateStakingGas = useCallback(async () => {
    const depositTxObject = depositTx();
    if (
      !celoAmount ||
      !depositTxObject ||
      celoAmount.isEqualTo(0) ||
      celoAmount.isGreaterThan(celoBalance)
    ) {
      return null;
    }
    const gasFee = new BigNumber(await depositTxObject.estimateGas(createTxOptions()));
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [createTxOptions, depositTx, celoBalance, celoAmount, celoToUSDRate, suggestedGasPrice]);

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
