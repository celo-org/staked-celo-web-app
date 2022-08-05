import { useAccountContext } from 'src/contexts/account/AccountContext';
import { CeloWei, StCeloWei, Wei } from 'src/utils/tokens';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoWeiAmount, setCeloWeiAmount, stake, estimateDepositValue } = useStaking();
  const { stCeloWeiAmount, setStCeloWeiAmount, unstake, estimateWithdrawalValue } = useUnstaking();

  const balance = mode === 'stake' ? celoBalance : stCeloBalance;
  const swap = mode === 'stake' ? stake : unstake;
  const estimateReceiveValue = mode === 'stake' ? estimateDepositValue : estimateWithdrawalValue;
  const amount = mode === 'stake' ? celoWeiAmount : stCeloWeiAmount;
  const setAmount =
    mode === 'stake'
      ? (amount?: Wei) => setCeloWeiAmount(!amount ? null : new CeloWei(amount))
      : (amount?: Wei) => setStCeloWeiAmount(!amount ? null : new StCeloWei(amount));

  return { amount, setAmount, balance, swap, estimateReceiveValue };
}
