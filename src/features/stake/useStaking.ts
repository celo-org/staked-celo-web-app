import { useCallback, useState } from 'react';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import { CeloWei } from 'src/types/units';

export function useStaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract } = useContracts();

  const createTxOptions = useCallback(
    (amount: CeloWei) => ({
      from: address,
      value: amount.toString(),
    }),
    [address]
  );

  const deposit = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const [isStaking, setIsStaking] = useState(false);
  const stake = useCallback(
    async (amount: CeloWei) => {
      setIsStaking(true);
      await deposit().send(createTxOptions(amount));
      await loadBalances();
      setIsStaking(false);
    },
    [createTxOptions, deposit, loadBalances]
  );

  const estimateGasFee = useCallback(
    async (amount: CeloWei): Promise<CeloWei> => {
      const gasFee = new CeloWei(await deposit().estimateGas(createTxOptions(amount)));
      const increasedGasFee = gasFee.plus(gasFee.dividedBy(10)).toString();
      return new CeloWei(increasedGasFee);
    },
    [createTxOptions, deposit]
  );

  return {
    stake,
    isStaking,
    estimateGasFee,
  };
}
