import { useStaking } from 'src/features/stake/useStaking';
import { SwapForm } from 'src/features/swap/SwapForm';
import { Switcher } from 'src/features/swap/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { useAccountContext } from 'src/providers/AccountProvider';
import toast from 'src/services/toast';
import { Celo, toCeloWei } from 'src/utils/tokens';

export const Stake = () => {
  const { stake, celoExchangeRate, estimateDepositValue, estimateStakingFee } = useStaking();
  const { celoBalance } = useAccountContext();

  const onSubmit = async (amount: number | undefined) => {
    if (!amount) return;
    const receivedAmount = await stake(toCeloWei(new Celo(amount)));
    toast.stakingSuccess(receivedAmount);
  };

  return (
    <CenteredLayout>
      <Switcher />
      <SwapForm
        estimateReceiveValue={estimateDepositValue}
        estimateGasFee={estimateStakingFee}
        onSubmit={onSubmit}
        balance={celoBalance}
        exchangeRate={celoExchangeRate}
        fromToken="CELO"
        toToken="stCELO"
      />
    </CenteredLayout>
  );
};
