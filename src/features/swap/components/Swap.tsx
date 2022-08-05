import { useCallback, useState } from 'react';
import { SwapForm } from 'src/features/swap/components/SwapForm';
import { Switcher } from 'src/features/swap/components/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Wei } from 'src/utils/tokens';
import { useDetails } from '../hooks/useDetails';
import { useSwap } from '../hooks/useSwap';
import { Mode } from '../types';
import { PendingWithdrawal } from './PendingWithdrawal';

interface SwapProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const Swap = ({ mode, onModeChange }: SwapProps) => {
  const [amount, setAmount] = useState<Wei>(new Wei(0));
  const { swap, balance, estimateReceiveValue, pendingWithdrawals } = useSwap(mode);
  const { details } = useDetails(mode, amount);

  const onSubmit = useCallback(async () => {
    if (amount.isEqualTo(0)) return;
    await swap(amount);
  }, [swap, amount]);

  const onChange = useCallback((weiAmount?: Wei) => {
    setAmount(weiAmount || new Wei(0));
  }, []);

  const receiveValue = estimateReceiveValue(amount);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={mode} onModeChange={onModeChange} />
      <SwapForm
        mode={mode}
        onSubmit={onSubmit}
        onChange={onChange}
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
