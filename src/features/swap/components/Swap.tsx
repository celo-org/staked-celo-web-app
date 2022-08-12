import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { useSwap } from '../hooks/useSwap';
import { Mode } from '../types';
import { validateAmount } from '../utils/validation';
import { Details } from './Details';
import { PendingWithdrawals } from './PendingWithdrawals';
import { SwapForm } from './SwapForm';
import { Switcher } from './Switcher';

interface SwapProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const Swap = ({ mode, onModeChange }: SwapProps) => {
  const { pendingWithdrawals } = useAccountContext();
  const { amount, setAmount, swap, balance, receiveAmount, swapRate, gasFee } = useSwap(mode);
  const error = validateAmount(amount, balance, mode);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={mode} onModeChange={onModeChange} />
      <SwapForm
        amount={amount}
        error={error}
        mode={mode}
        onSubmit={swap}
        onChange={setAmount}
        balance={balance}
        receiveAmount={receiveAmount}
        onModeChange={onModeChange}
      />
      <OpacityTransition id={mode}>
        <div className="w-full px-[8px]">
          {!error && amount?.isGreaterThan(0) && (
            <Details mode={mode} swapRate={swapRate} gasFee={gasFee} />
          )}
          {mode === 'unstake' && pendingWithdrawals.length !== 0 ? (
            <PendingWithdrawals pendingWithdrawals={pendingWithdrawals} />
          ) : null}
        </div>
      </OpacityTransition>
    </CenteredLayout>
  );
};
