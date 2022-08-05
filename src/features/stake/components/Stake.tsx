import { useCallback, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { SwapForm } from 'src/features/swap/components/SwapForm';
import { Switcher } from 'src/features/swap/components/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import toast from 'src/services/toast';
import { CeloWei, Wei } from 'src/utils/tokens';
import { useDetails } from '../hooks/useDetails';
import { useStaking } from '../hooks/useStaking';

export const Stake = () => {
  const { stake, estimateDepositValue } = useStaking();
  const [amount, setAmount] = useState<CeloWei>(new CeloWei(0));
  const { details } = useDetails(amount);
  const { celoBalance } = useAccountContext();

  const onSubmit = useCallback(async () => {
    if (amount.isEqualTo(0)) return;
    const receivedAmount = await stake(amount);
    toast.stakingSuccess(receivedAmount);
  }, [stake, amount]);

  const onChange = useCallback((weiAmount?: Wei) => {
    setAmount(new CeloWei(weiAmount || 0));
  }, []);

  const receiveValue = estimateDepositValue(amount);

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher />
      <SwapForm
        onSubmit={onSubmit}
        onChange={onChange}
        balance={celoBalance}
        mode="stake"
        receiveValue={receiveValue}
        details={details}
      />
    </CenteredLayout>
  );
};
