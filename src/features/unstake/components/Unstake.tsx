import { useCallback, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { SwapForm } from 'src/features/swap/components/SwapForm';
import { Switcher } from 'src/features/swap/components/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import toast from 'src/services/toast';
import { StCelo, toStCeloWei } from 'src/utils/tokens';
import { useDetails } from '../hooks/useDetails';
import { useUnstaking } from '../hooks/useUnstaking';
import { PendingWithdrawal } from './PendingWithdrawal';

export const Unstake = () => {
  const { stCeloBalance, pendingWithdrawals } = useAccountContext();
  const [amount, setAmount] = useState<number>(0);
  const { details } = useDetails(amount);
  const { unstake, estimateWithdrawalValue } = useUnstaking();

  const onSubmit = useCallback(async () => {
    if (!amount) return;
    await unstake(toStCeloWei(new StCelo(amount)));
    toast.unstakingStartedSuccess();
  }, [unstake, amount]);

  const receiveValue = estimateWithdrawalValue(amount);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher />
      <SwapForm
        onSubmit={onSubmit}
        onChange={setAmount}
        balance={stCeloBalance}
        fromToken="stCELO"
        toToken="CELO"
        receiveValue={receiveValue}
        details={details}
      />
      {pendingWithdrawals.length !== 0 ? (
        <span className="font-semibold text-sm mt-12">Currently unstaking</span>
      ) : null}
      {pendingWithdrawals.map(({ amount, timestamp }) => (
        <PendingWithdrawal key={timestamp} amount={amount} timestamp={timestamp} />
      ))}
    </CenteredLayout>
  );
};
