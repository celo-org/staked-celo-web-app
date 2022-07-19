import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { toWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';

export function useStaking() {
  const { address, loadBalances } = useAccount();
  const { managerContract } = useContracts();

  const createTxOptions = useCallback(
    (celoAmount: BigNumber) => ({
      from: address,
      value: celoAmount.toString(),
    }),
    [address]
  );

  const deposit = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const [isStaking, setIsStaking] = useState(false);
  const stake = useCallback(
    async (celoAmount: BigNumber) => {
      setIsStaking(true);
      await deposit().send(createTxOptions(celoAmount));
      await loadBalances();
      setIsStaking(false);
    },
    [createTxOptions, deposit, loadBalances]
  );

  const estimateFee = useCallback(
    async (celoAmount: BigNumber): Promise<BigNumber> => {
      const estimatedFee = new BigNumber(await deposit().estimateGas(createTxOptions(celoAmount)));
      return estimatedFee.plus(estimatedFee.dividedBy(10));
    },
    [createTxOptions, deposit]
  );

  const [exchangeRate, setExchangeRate] = useState(0);

  const loadExchangeRate = useCallback(async () => {
    const oneCeloInWei = toWei(new BigNumber('1'));
    const stakedCeloAmount = new BigNumber(
      await managerContract.methods.toStakedCelo(oneCeloInWei).call({ from: address })
    );
    setExchangeRate(stakedCeloAmount.dividedBy(oneCeloInWei).toNumber());
  }, [managerContract, address]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadExchangeRate();
  }, [loadExchangeRate]);

  return {
    stake,
    isStaking,
    estimateFee,
    exchangeRate,
  };
}
