import { SwapForm } from 'src/features/swap/SwapForm';
import { useUnstaking } from 'src/features/unstake/useUnstaking';
import { toStCeloWei } from 'src/formatters/amount';
import { useAccountContext } from 'src/providers/AccountProvider';
import toast from 'src/services/toast';
import { StCelo } from 'src/types/units';
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
    <div className="flex flex-col md:w-96 mx-auto w-full px-4 mb-14">
      <SwapForm
        estimateReceiveValue={estimateWithdrawalValue}
        estimateGasFee={estimateUnstakingFee}
        onSubmit={onSubmit}
        balance={stCeloBalance}
        exchangeRate={stCeloExchangeRate}
        fromToken="stCELO"
        toToken="CELO"
      />
      {pendingWithdrawals.length && (
        <span className="text-white text-bold text-sm mt-12">Currently unstaking</span>
      )}
      {pendingWithdrawals.map(({ amount, timestamp }) => (
        <PendingWithdrawal key={timestamp} amount={amount} timestamp={timestamp} />
      ))}
    </div>
  );
};
