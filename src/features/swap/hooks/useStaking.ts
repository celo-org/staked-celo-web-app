import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import toast from 'src/services/toast';
import { CeloWei, StCeloWei } from 'src/utils/tokens';

export function useStaking() {
  const { address, loadBalances, celoBalance } = useAccountContext();
  const { managerContract, stCeloContract, sendTransaction } = useBlockchain();
  const { celoExchangeRate } = useExchangeContext();
  const [celoWeiAmount, setCeloWeiAmount] = useState<CeloWei | null>(null);

  const createTxOptions = useCallback(
    () => ({
      from: address!,
      value: celoWeiAmount?.toFixed(),
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address, celoWeiAmount]
  );

  const depositTx = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = useCallback(async () => {
    if (!celoWeiAmount || celoWeiAmount.isEqualTo(0)) return;
    const preDepositStWeiBalance = new StCeloWei(
      await stCeloContract.methods.balanceOf(address).call()
    );
    await sendTransaction(depositTx(), createTxOptions());
    await loadBalances();
    const postDepositStWeiBalance = new StCeloWei(
      await stCeloContract.methods.balanceOf(address).call()
    );
    const receivedStWei = new StCeloWei(postDepositStWeiBalance.minus(preDepositStWeiBalance));
    toast.stakingSuccess(receivedStWei);
    setCeloWeiAmount(null);
  }, [
    createTxOptions,
    depositTx,
    loadBalances,
    stCeloContract,
    address,
    sendTransaction,
    celoWeiAmount,
  ]);

  const estimateStakingGas = useCallback(async (): Promise<CeloWei> => {
    if (!celoWeiAmount || celoWeiAmount.isEqualTo(0) || celoWeiAmount.isGreaterThan(celoBalance))
      return new CeloWei(0);
    const gasFee = new BigNumber(await depositTx().estimateGas(createTxOptions()));
    return new CeloWei(gasFee.multipliedBy(GAS_PRICE));
  }, [createTxOptions, depositTx, celoBalance, celoWeiAmount]);

  const receivedStCeloWei = new StCeloWei(
    celoWeiAmount ? celoWeiAmount.multipliedBy(celoExchangeRate) : 0
  );

  return {
    celoWeiAmount,
    setCeloWeiAmount,
    stake,
    celoExchangeRate,
    estimateStakingGas,
    receivedStCeloWei,
  };
}
