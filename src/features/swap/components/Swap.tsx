import { Switcher } from 'src/components/switcher/Switcher';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';
import { useSwap } from '../hooks/useSwap';
import { validateAmount } from '../utils/validation';
import { Details } from './Details';
import { PendingWithdrawals } from './PendingWithdrawals';
import { SwapForm } from './SwapForm';



export const Swap = ({ mode }: SwapProps) => {
  const { pendingWithdrawals } = useAccountContext();
  const { amount, setAmount, swap, balance, receiveAmount, swapRate, gasFee, setMaxAmount } =
    useSwap(mode);
  const error = validateAmount(amount, balance, mode);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={mode} />
      <SwapForm
        mode={mode}
        amount={amount}
        receiveAmount={receiveAmount}
        balance={balance}
        error={error}
        setMaxAmount={setMaxAmount}
        onSubmit={swap}
        onChange={setAmount}
      />
      <OpacityTransition id={mode}>
        <div className="w-full px-[8px]">
          {!error && gasFee && <Details mode={mode} swapRate={swapRate} gasFee={gasFee} />}
          {mode === Mode.unstake && pendingWithdrawals.length !== 0 ? (
            <PendingWithdrawals pendingWithdrawals={pendingWithdrawals} />
          ) : null}
        </div>
      </OpacityTransition>
    </CenteredLayout>
  );
};
