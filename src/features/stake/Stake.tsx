import { useCallback, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { SwapForm } from 'src/features/swap/SwapForm';
import { Switcher } from 'src/features/swap/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import toast from 'src/services/toast';
import { Celo, toCeloWei } from 'src/utils/tokens';
import { useCosts } from './useCosts';
import { useStaking } from './useStaking';

export const Stake = () => {
  const { stake, estimateDepositValue } = useStaking();
  const [amount, setAmount] = useState<number | undefined>();
  const { costs } = useCosts(amount);
  const { celoBalance } = useAccountContext();

  const onSubmit = useCallback(async () => {
    if (!amount) return;
    const receivedAmount = await stake(toCeloWei(new Celo(amount)));
    toast.stakingSuccess(receivedAmount);
  }, [stake, amount]);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher />
      <SwapForm
        estimateReceiveValue={estimateDepositValue}
        onSubmit={onSubmit}
        onChange={setAmount}
        balance={celoBalance}
        fromToken="CELO"
        toToken="stCELO"
        costs={costs}
      />
    </CenteredLayout>
  );
};
