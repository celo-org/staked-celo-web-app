import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useStake } from 'src/features/stake/useStake';

const estDepositValue = (amount: number) => amount * 1.03;

export function useEstimate() {
  const { address } = useCelo();
  const { managerContract } = useStake();

  const estStCELO = async (celoAmount: BigNumber) => {
    const stCELOAmount = await managerContract.methods
      .toStakedCelo(celoAmount.toString())
      .call({ from: address });
    return stCELOAmount;
  };

  return {
    estStCELO,
    estDepositValue,
  };
}
