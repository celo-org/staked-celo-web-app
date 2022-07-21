import { SwapForm } from 'src/features/swap/SwapForm';
import { SwapFormValues } from 'src/features/swap/types';
import { useUnstaking } from 'src/features/unstake/useUnstaking';
import { toStCeloWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { StCelo } from 'src/types/units';

export const Unstake = () => {
  const { stCeloBalance } = useAccount();
  const { unstake, stCeloExchangeRate, estimateWithdrawalValue, estimateUnstakingFee } =
    useUnstaking();

  const onSubmit = async ({ amount }: SwapFormValues) => {
    if (!amount) return;
    await unstake(toStCeloWei(new StCelo(amount)));
  };

  return (
    <div className="flex justify-center md:w-96 mx-auto w-full px-4 mb-14">
      <SwapForm
        estimateReceiveValue={estimateWithdrawalValue}
        estimateGasFee={estimateUnstakingFee}
        onSubmit={onSubmit}
        balance={stCeloBalance}
        exchangeRate={stCeloExchangeRate}
        fromToken="stCELO"
        toToken="CELO"
      />
    </div>
  );
};
