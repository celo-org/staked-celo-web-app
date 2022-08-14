import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { TxCallbacks, useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, CeloUSD, StCelo } from 'src/utils/tokens';
import { showStakingToast } from '../utils/toast';

export function useStaking() {
  const { address, loadBalances, celoBalance } = useAccountContext();
  const { managerContract, stCeloContract, sendTransaction } = useBlockchain();
  const { stakingRate, celoToUSDRate } = useProtocolContext();
  const [celoAmount, setCeloAmount] = useState<Celo | null>(null);
  const [stakingGasFee, setStakingGasFee] = useState<CeloUSD>(new CeloUSD(0));

  const createTxOptions = useCallback(
    () => ({
      from: address!,
      value: celoAmount?.toFixed(),
    }),
    [address, celoAmount]
  );

  const depositTx = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = async (callbacks?: TxCallbacks) => {
    if (!celoAmount || celoAmount.isEqualTo(0)) return;
    const preDepositStTokenBalance = new StCelo(
      await stCeloContract.methods.balanceOf(address).call()
    );
    await sendTransaction(depositTx(), createTxOptions(), callbacks);
    await loadBalances();
    const postDepositStTokenBalance = new StCelo(
      await stCeloContract.methods.balanceOf(address).call()
    );
    const receivedStCelo = new StCelo(postDepositStTokenBalance.minus(preDepositStTokenBalance));
    showStakingToast(receivedStCelo);
    setCeloAmount(null);
  };

  const estimateStakingGas = useCallback(async () => {
    if (!celoAmount || celoAmount.isEqualTo(0) || celoAmount.isGreaterThan(celoBalance)) {
      setStakingGasFee(new CeloUSD(0));
      return;
    }
    const gasFee = new BigNumber(await depositTx().estimateGas(createTxOptions()));
    const gasFeeInCelo = new Celo(gasFee.multipliedBy(GAS_PRICE));
    const gasFeeInUSD = new CeloUSD(gasFeeInCelo.multipliedBy(celoToUSDRate));
    setStakingGasFee(gasFeeInUSD);
  }, [createTxOptions, depositTx, celoBalance, celoAmount, celoToUSDRate]);

  const receivedStCelo = useMemo(
    () => (celoAmount ? new StCelo(celoAmount.multipliedBy(stakingRate).dp(0)) : null),
    [celoAmount, stakingRate]
  );

  useEffect(() => void estimateStakingGas(), [estimateStakingGas]);

  return {
    celoAmount,
    setCeloAmount,
    stake,
    stakingGasFee,
    receivedStCelo,
  };
}
