import { useAccountContext } from 'src/contexts/account/AccountContext';
import { SwapForm } from 'src/features/swap/components/SwapForm';
import { Switcher } from 'src/features/swap/components/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { useDetails } from '../hooks/useDetails';
import { useSwap } from '../hooks/useSwap';
import { Mode } from '../types';
import { PendingWithdrawal } from './PendingWithdrawal';

interface SwapProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const Swap = ({ mode, onModeChange }: SwapProps) => {
  const { pendingWithdrawals } = useAccountContext();
  const { amount, setAmount, swap, balance, receiveValue, exchangeRate, gasFee } = useSwap(mode);
  const { details } = useDetails(mode, exchangeRate, gasFee);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={mode} onModeChange={onModeChange} />
      <SwapForm
        amount={amount}
        mode={mode}
        onSubmit={swap}
        onChange={setAmount}
        balance={balance}
        receiveValue={receiveValue}
        details={details}
      />
      {mode === 'unstake' && pendingWithdrawals.length !== 0 ? (
        <span className="font-semibold text-sm mt-12">Currently unstaking</span>
      ) : null}
      {mode === 'unstake' &&
        pendingWithdrawals.map(({ amount, timestamp }) => (
          <PendingWithdrawal key={timestamp} amount={amount} timestamp={timestamp} />
        ))}
    </CenteredLayout>
  );
};
