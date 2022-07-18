import BigNumber from 'bignumber.js';
import { toWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';

export function useStaking() {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const createTxOptions = (celoAmount: BigNumber) => ({
    from: address,
    value: celoAmount.toString(),
  });

  const deposit = () => managerContract.methods.deposit();

  const stake = (celoAmount: BigNumber) => deposit().send(createTxOptions(celoAmount));

  const estimateStakingFee = async (celoAmount: BigNumber): Promise<BigNumber> => {
    const estimatedFee = new BigNumber(await deposit().estimateGas(createTxOptions(celoAmount)));
    return estimatedFee.plus(estimatedFee.dividedBy(10));
  };

  const getStakedCeloExchageRate = async (): Promise<BigNumber> => {
    const oneCeloInWei = toWei(new BigNumber('1'));
    const stakedCeloAmount = new BigNumber(
      await managerContract.methods.toStakedCelo(oneCeloInWei).call({ from: address })
    );
    return stakedCeloAmount.dividedBy(oneCeloInWei);
  };

  return {
    stake,
    estimateStakingFee,
    getStakedCeloExchageRate,
  };
}
