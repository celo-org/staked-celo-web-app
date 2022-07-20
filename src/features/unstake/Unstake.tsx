import { SwapForm } from 'src/features/swap/SwapForm';
import { SwapFormValues } from 'src/features/swap/types';
import { useEstimations } from 'src/features/unstake/useEstimations';
import { useUnstaking } from 'src/features/unstake/useUnstaking';
import { toStCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { StakedCelo } from 'src/types/units';

export const Unstake = () => {
  const { stCeloBalance } = useAccount();
  const { estimateWithdrawValue } = useEstimations();
  const { unstake } = useUnstaking();

  const onSubmit = async ({ amount }: SwapFormValues) => {
    if (!amount) return;
    await unstake(toStCeloWei(new StakedCelo(amount)));
  };

  return (
    <div className="flex justify-center md:w-96 mx-auto w-full px-4 mb-14">
      <SwapForm
        estimateReceiveValue={estimateWithdrawValue}
        onSubmit={onSubmit}
        balance={stCeloBalance}
        fromToken="stCELO"
        toToken="CELO"
      />
    </div>
  );
};
