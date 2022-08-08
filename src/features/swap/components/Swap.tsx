import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { useDetails } from '../hooks/useDetails';
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
  const { amount, setAmount, swap, balance, receiveAmount, exchangeRate, gasFee } = useSwap(mode);
  const { details } = useDetails(mode, exchangeRate, gasFee);
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
        details={details}
      />
      <OpacityTransition id={mode}>
        <div className="w-full px-[8px]">
          {!error && amount?.isGreaterThan(0) && <Details details={details} />}
          {mode === 'unstake' && pendingWithdrawals.length !== 0 ? (
            <PendingWithdrawals pendingWithdrawals={pendingWithdrawals} />
          ) : null}
        </div>
      </OpacityTransition>
    </CenteredLayout>
  );
};
