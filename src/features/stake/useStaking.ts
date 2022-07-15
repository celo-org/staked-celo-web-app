import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useContracts } from 'src/hooks/useContracts';

export function useStaking() {
  const { address } = useCelo();
  const { managerContract } = useContracts();

  const stake = async (celoAmount: BigNumber) => {
    await managerContract.methods.deposit().send({
      from: address,
      value: celoAmount.toString(),
    });
  };

  return {
    stake,
  };
}
