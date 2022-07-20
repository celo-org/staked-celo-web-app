import { SwapForm } from 'src/features/swap/SwapForm';
import { SwapFormValues } from 'src/features/swap/types';
import { useAccount } from 'src/hooks/useAccount';

export const Unstake = () => {
  const { stakedCeloBalance } = useAccount();

  const onSubmit = async ({ amount }: SwapFormValues) => {
    // eslint-disable-next-line no-console
    console.log(amount);
  };

  return (
    <div className="flex justify-center md:w-96 mx-auto">
      <SwapForm onSubmit={onSubmit} balance={stakedCeloBalance} toToken="stCELO" fromToken="CELO" />
    </div>
  );
};
