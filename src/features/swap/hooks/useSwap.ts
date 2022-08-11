import { useEffect } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { Celo, StCelo, Token } from 'src/utils/tokens';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { celoExchangeRate, stCeloExchangeRate } = useExchangeContext();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoAmount, setCeloAmount, stake, receivedStCelo, stakingGasFee } = useStaking();
  const { stCeloAmount, setStCeloAmount, unstake, receivedCelo, unstakingGasFee } = useUnstaking();

  const exchangeRate = mode === 'stake' ? celoExchangeRate : stCeloExchangeRate;
  const gasFee = mode === 'stake' ? stakingGasFee : unstakingGasFee;
  const balance = mode === 'stake' ? celoBalance : stCeloBalance;
  const swap = mode === 'stake' ? stake : unstake;
  const receiveAmount = mode === 'stake' ? receivedStCelo : receivedCelo;
  const amount = mode === 'stake' ? celoAmount : stCeloAmount;
  const setAmount =
    mode === 'stake'
      ? (amount?: Token) => setCeloAmount(!amount ? null : new Celo(amount))
      : (amount?: Token) => setStCeloAmount(!amount ? null : new StCelo(amount));

  // When switching modes expected received amount should be set as provided amount
  // Because receiveAmount is updated after mode is changed we need to perform instance type check
  useEffect(() => {
    if (receiveAmount.isEqualTo(0)) return;
    if (mode === 'stake' && receiveAmount instanceof StCelo) {
      setStCeloAmount(receiveAmount);
    } else if (mode === 'unstake' && receiveAmount instanceof Celo) {
      setCeloAmount(receiveAmount);
    }
  }, [mode, receiveAmount, setCeloAmount, setStCeloAmount]);

  return { amount, setAmount, balance, swap, receiveAmount, exchangeRate, gasFee };
}
