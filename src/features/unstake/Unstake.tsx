import { SwapForm } from 'src/features/swap/SwapForm';
import { SwapFormValues } from 'src/features/swap/types';
import { useEstimations } from 'src/features/unstake/useEstimations';
import { useUnstaking } from 'src/features/unstake/useUnstaking';
import { toStakedCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { StakedCelo } from 'src/types/units';

export const Unstake = () => {
  const { stakedCeloBalance } = useAccount();
  const { estimateWithdrawValue } = useEstimations();
  const { unstake } = useUnstaking();

  const onSubmit = async ({ amount }: SwapFormValues) => {
    if (!amount) return;
    await unstake(toStakedCeloWei(new StakedCelo(amount)));
  };

  return (
    <div className="flex justify-center md:w-96 mx-auto">
      <SwapForm
        estimateReceiveValue={estimateWithdrawValue}
        onSubmit={onSubmit}
        balance={stakedCeloBalance}
        toToken="stCELO"
        fromToken="CELO"
      />
    </div>
  );
};
