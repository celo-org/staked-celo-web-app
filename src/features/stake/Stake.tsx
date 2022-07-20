import { useEstimations } from 'src/features/stake/useEstimations';
import { useStaking } from 'src/features/stake/useStaking';
import { SwapForm } from 'src/features/swap/SwapForm';
import { SwapFormValues } from 'src/features/swap/types';
import { toCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { Celo } from 'src/types/units';

export const Stake = () => {
  const { stake } = useStaking();
  const { celoBalance } = useAccount();
  const { estimateDepositValue } = useEstimations();

  const onSubmit = async ({ amount }: SwapFormValues) => {
    if (!amount) return;
    await stake(toCeloWei(new Celo(amount)));
  };

  return (
    <div className="flex justify-center md:w-96 mx-auto px-4">
      <SwapForm
        estimateReceiveValue={estimateDepositValue}
        onSubmit={onSubmit}
        balance={celoBalance}
        toToken="CELO"
        fromToken="stCELO"
      />
    </div>
  );
};
