import { useCallback, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { SwapForm } from 'src/features/swap/SwapForm';
import { Switcher } from 'src/features/swap/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import toast from 'src/services/toast';
import { Celo, toCeloWei } from 'src/utils/tokens';
import { useDetails } from './useDetails';
import { useStaking } from './useStaking';

export const Stake = () => {
  const { stake, estimateDepositValue } = useStaking();
  const [amount, setAmount] = useState<number>(0);
  const { details } = useDetails(amount);
  const { celoBalance } = useAccountContext();

  const onSubmit = useCallback(async () => {
    if (!amount) return;
    const receivedAmount = await stake(toCeloWei(new Celo(amount)));
    toast.stakingSuccess(receivedAmount);
  }, [stake, amount]);

  const receiveValue = estimateDepositValue(amount);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher />
      <SwapForm
        onSubmit={onSubmit}
        onChange={setAmount}
        balance={celoBalance}
        fromToken="CELO"
        toToken="stCELO"
        receiveValue={receiveValue}
        details={details}
      />
    </CenteredLayout>
  );
};
