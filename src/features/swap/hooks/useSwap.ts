import { useAccountContext } from 'src/contexts/account/AccountContext';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { celoBalance, stCeloBalance, pendingWithdrawals } = useAccountContext();
  const { stake, estimateDepositValue } = useStaking();
  const { unstake, estimateWithdrawalValue } = useUnstaking();

  const balance = mode === 'stake' ? celoBalance : stCeloBalance;
  const swap = mode === 'stake' ? stake : unstake;
  const estimateReceiveValue = mode === 'stake' ? estimateDepositValue : estimateWithdrawalValue;
  return { balance, swap, estimateReceiveValue, pendingWithdrawals };
}
