import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useContracts } from 'src/hooks/useContracts';

const estimateDepositValue = (amount: number) => amount * 1.03;

export function useEstimations() {
  const { address } = useCelo();
  const { managerContract } = useContracts();

  const estimateStCELO = async (celoAmount: BigNumber) => {
    const stCELOAmount = await managerContract.methods
      .toStakedCelo(celoAmount.toString())
      .call({ from: address });
    return stCELOAmount;
  };

  return {
    estimateStCELO,
    estimateDepositValue,
  };
}
