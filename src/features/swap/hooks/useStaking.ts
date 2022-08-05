import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { GAS_LIMIT, GAS_PRICE } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import toast from 'src/services/toast';
import { Celo, StCelo } from 'src/utils/tokens';

export function useStaking() {
  const { address, loadBalances, celoBalance } = useAccountContext();
  const { managerContract, stCeloContract, sendTransaction } = useBlockchain();
  const { celoExchangeRate } = useExchangeContext();
  const [celoAmount, setCeloAmount] = useState<Celo | null>(null);
  const [stakingGasFee, setStakingGasFee] = useState<Celo>(new Celo(0));

  const createTxOptions = useCallback(
    () => ({
      from: address!,
      value: celoAmount?.toFixed(),
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
    }),
    [address, celoAmount]
  );

  const depositTx = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = async () => {
    if (!celoAmount || celoAmount.isEqualTo(0)) return;
    const preDepositStTokenBalance = new StCelo(
      await stCeloContract.methods.balanceOf(address).call()
    );
    await sendTransaction(depositTx(), createTxOptions());
    await loadBalances();
    const postDepositStTokenBalance = new StCelo(
      await stCeloContract.methods.balanceOf(address).call()
    );
    const receivedStToken = new StCelo(postDepositStTokenBalance.minus(preDepositStTokenBalance));
    toast.stakingSuccess(receivedStToken);
    setCeloAmount(null);
  };

  const estimateStakingGas = useCallback(async () => {
    if (!celoAmount || celoAmount.isEqualTo(0) || celoAmount.isGreaterThan(celoBalance)) {
      setStakingGasFee(new Celo(0));
      return;
    }
    const gasFee = new BigNumber(await depositTx().estimateGas(createTxOptions()));
    setStakingGasFee(new Celo(gasFee.multipliedBy(GAS_PRICE)));
  }, [createTxOptions, depositTx, celoBalance, celoAmount]);

  const receivedStCelo = new StCelo(celoAmount ? celoAmount.multipliedBy(celoExchangeRate) : 0);

  useEffect(() => void estimateStakingGas(), [estimateStakingGas]);

  return {
    celoAmount,
    setCeloAmount,
    stake,
    celoExchangeRate,
    stakingGasFee,
    receivedStCelo,
  };
}
