import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { CeloWei, StCeloWei, Wei } from 'src/utils/tokens';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { celoExchangeRate, stCeloExchangeRate } = useExchangeContext();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoWeiAmount, setCeloWeiAmount, stake, receivedStCeloWei, estimateStakingGas } =
    useStaking();
  const { stCeloWeiAmount, setStCeloWeiAmount, unstake, receivedCeloWei, estimateUnstakingGas } =
    useUnstaking();

  const exchangeRate = mode === 'stake' ? celoExchangeRate : stCeloExchangeRate;
  const estimateGas = mode === 'stake' ? estimateStakingGas : estimateUnstakingGas;
  const balance = mode === 'stake' ? celoBalance : stCeloBalance;
  const swap = mode === 'stake' ? stake : unstake;
  const receiveValue = mode === 'stake' ? receivedStCeloWei : receivedCeloWei;
  const amount = mode === 'stake' ? celoWeiAmount : stCeloWeiAmount;
  const setAmount =
    mode === 'stake'
      ? (amount?: Wei) => setCeloWeiAmount(!amount ? null : new CeloWei(amount))
      : (amount?: Wei) => setStCeloWeiAmount(!amount ? null : new StCeloWei(amount));

  return { amount, setAmount, balance, swap, receiveValue, exchangeRate, estimateGas };
}
