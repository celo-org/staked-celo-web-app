import { useStaking } from 'src/features/stake/useStaking';
import { SwapForm } from 'src/features/swap/SwapForm';
import { toCeloWei } from 'src/formatters/amount';
import { useAccountContext } from 'src/providers/AccountProvider';
import toast from 'src/services/toast';
import { Celo } from 'src/types/units';

export const Stake = () => {
  const { stake, celoExchangeRate, estimateDepositValue, estimateStakingFee } = useStaking();
  const { celoBalance } = useAccountContext();

  const onSubmit = async (amount: number | undefined) => {
    if (!amount) return;
    const receivedAmount = await stake(toCeloWei(new Celo(amount)));
    toast.stakingSuccess(receivedAmount);
  };

  return (
    <div className="flex flex-col md:w-96 mx-auto w-full px-4 mb-14">
      <SwapForm
        estimateReceiveValue={estimateDepositValue}
        estimateGasFee={estimateStakingFee}
        onSubmit={onSubmit}
        balance={celoBalance}
        exchangeRate={celoExchangeRate}
        fromToken="CELO"
        toToken="stCELO"
      />
    </div>
  );
};
