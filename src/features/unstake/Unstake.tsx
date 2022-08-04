import { useCallback, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { SwapForm } from 'src/features/swap/SwapForm';
import { Switcher } from 'src/features/swap/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import toast from 'src/services/toast';
import { StCelo, toStCeloWei } from 'src/utils/tokens';
import { PendingWithdrawal } from './PendingWithdrawal';
import { useCosts } from './useCosts';
import { useUnstaking } from './useUnstaking';

export const Unstake = () => {
  const { stCeloBalance, pendingWithdrawals } = useAccountContext();
  const [amount, setAmount] = useState<number | undefined>();
  const { costs } = useCosts(amount);
  const { unstake, estimateWithdrawalValue } = useUnstaking();

  const onSubmit = useCallback(async () => {
    if (!amount) return;
    await unstake(toStCeloWei(new StCelo(amount)));
    toast.unstakingStartedSuccess();
  }, [unstake, amount]);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher />
      <SwapForm
        estimateReceiveValue={estimateWithdrawalValue}
        onSubmit={onSubmit}
        onChange={setAmount}
        balance={stCeloBalance}
        fromToken="stCELO"
        toToken="CELO"
        costs={costs}
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
