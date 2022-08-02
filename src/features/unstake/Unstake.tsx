import { SwapForm } from 'src/features/swap/SwapForm';
import { Switcher } from 'src/features/swap/Switcher';
import { useUnstaking } from 'src/features/unstake/useUnstaking';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { useAccountContext } from 'src/providers/AccountProvider';
import toast from 'src/services/toast';
import { StCelo, toStCeloWei } from 'src/utils/tokens';
import { PendingWithdrawal } from './PendingWithdrawal';

export const Unstake = () => {
  const { stCeloBalance, pendingWithdrawals } = useAccountContext();
  const { unstake, stCeloExchangeRate, estimateWithdrawalValue, estimateUnstakingFee } =
    useUnstaking();

  const onSubmit = async (amount: number | undefined) => {
    if (!amount) return;
    await unstake(toStCeloWei(new StCelo(amount)));
    toast.unstakingStartedSuccess();
  };

  return (
    <CenteredLayout>
      <Switcher />
      <SwapForm
        estimateReceiveValue={estimateWithdrawalValue}
        estimateGasFee={estimateUnstakingFee}
        onSubmit={onSubmit}
        balance={stCeloBalance}
        exchangeRate={stCeloExchangeRate}
        fromToken="stCELO"
        toToken="CELO"
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
