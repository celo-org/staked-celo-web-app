import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { toWei } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import { useContracts } from 'src/hooks/useContracts';
import logger from 'src/services/logger';

export function useStaking() {
  const { address } = useAccount();
  const { managerContract } = useContracts();

  const createTxOptions = useCallback(
    (celoAmount: BigNumber) => ({
      from: address,
      value: celoAmount.toString(),
    }),
    [address]
  );

  const deposit = useCallback(() => managerContract.methods.deposit(), [managerContract]);

  const stake = useCallback(
    (celoAmount: BigNumber) => deposit().send(createTxOptions(celoAmount)),
    [createTxOptions, deposit]
  );

  const estimateStakingFee = useCallback(
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
    loadExchangeRate().catch((error: any) => logger.error(error?.message));
  }, [loadExchangeRate]);

  return {
    stake,
    estimateStakingFee,
    exchangeRate,
  };
}
