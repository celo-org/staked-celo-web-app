import { useCallback, useMemo, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useAPI } from 'src/hooks/useAPI';
import { Mode } from 'src/types';
import { transactionEvent } from 'src/utils/ga';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { showStakingToast } from '../utils/toast';

export function useStaking() {
  const { address, loadBalances, celoBalance } = useAccountContext();
  const { managerContract, stCeloContract, sendTransaction } = useBlockchain();
  const { api } = useAPI();
  const { stakingRate, celoToUSDRate, suggestedGasPrice } = useProtocolContext();
  const [celoAmount, setCeloAmount] = useState<Celo | null>(null);

  const stake = useCallback(
    async (callbacks?: TxCallbacks) => {
      if (!address || !managerContract || !stCeloContract || !celoAmount || celoAmount.isEqualTo(0))
        return;

      const { request } = await managerContract.contract.simulate.deposit({
        account: address,
        value: celoAmount?.toFixed(),
      });
      const preDepositStTokenBalance = new StCelo(
        await stCeloContract.contract.read.balanceOf([address])
      );
      transactionEvent({
        action: Mode.stake,
        status: 'initiated_transaction',
        value: celoAmount.displayAsBase(),
      });
      await sendTransaction(request, callbacks);
      transactionEvent({
        action: Mode.stake,
        status: 'signed_transaction',
        value: celoAmount.displayAsBase(),
      });
      void api.activate(); // TODO: should this be awaited? added void to shut linter.
      await loadBalances();
      const postDepositStTokenBalance = new StCelo(
        await stCeloContract.contract.read.balanceOf([address])
      );
      const receivedStCelo = new StCelo(postDepositStTokenBalance.minus(preDepositStTokenBalance));
      showStakingToast(receivedStCelo);
      setCeloAmount(null);
    },
    [address, api, celoAmount, loadBalances, managerContract, sendTransaction, stCeloContract]
  );

  const estimateStakingGas = useCallback(async () => {
    if (
      !celoAmount ||
      celoAmount.isEqualTo(0) ||
      celoAmount.isGreaterThan(celoBalance) ||
      !managerContract
    ) {
      return null;
    }
    const gasFee = new Token(
      await managerContract.contract.estimateGas.deposit({
        account: address,
        value: celoAmount?.toFixed(),
      })
    );
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(suggestedGasPrice));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    return gasFeeInUSD;
  }, [celoAmount, celoBalance, managerContract, address, suggestedGasPrice, celoToUSDRate]);

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
