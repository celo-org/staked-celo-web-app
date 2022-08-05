import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { Celo, StCelo, Token } from 'src/utils/tokens';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { celoExchangeRate, stCeloExchangeRate } = useExchangeContext();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoAmount, setCeloAmount, stake, receivedStCelo, estimateStakingGas } = useStaking();
  const { stCeloAmount, setStCeloAmount, unstake, receivedCelo, estimateUnstakingGas } =
    useUnstaking();

  const exchangeRate = mode === 'stake' ? celoExchangeRate : stCeloExchangeRate;
  const estimateGas = mode === 'stake' ? estimateStakingGas : estimateUnstakingGas;
  const balance = mode === 'stake' ? celoBalance : stCeloBalance;
  const swap = mode === 'stake' ? stake : unstake;
  const receiveValue = mode === 'stake' ? receivedStCelo : receivedCelo;
  const amount = mode === 'stake' ? celoAmount : stCeloAmount;
  const setAmount =
    mode === 'stake'
      ? (amount?: Token) => setCeloAmount(!amount ? null : new Celo(amount))
      : (amount?: Token) => setStCeloAmount(!amount ? null : new StCelo(amount));

  return { amount, setAmount, balance, swap, receiveValue, exchangeRate, estimateGas };
}
