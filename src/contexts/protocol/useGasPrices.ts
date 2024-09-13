import { gasPriceMinimumABI } from '@celo/abis';
import { useMemo } from 'react';
import { GAS_PRICE, GAS_PRICE_MULTIPLIER } from 'src/config/consts';
import useCeloRegistryAddress from 'src/hooks/useCeloRegistryAddress';
import { Token } from 'src/utils/tokens';
import { useReadContract } from 'wagmi';

export const useGasPrices = () => {
  const address = useCeloRegistryAddress('GasPriceMinimum');
  const {
    data: minimumGasPrice,
    isLoading: gasPriceMinimumLoading,
    refetch: loadGasPrices,
  } = useReadContract({
    abi: gasPriceMinimumABI,
    address,
    functionName: 'gasPriceMinimum',
  });

  const suggestedGasPrice = useMemo(() => {
    if (gasPriceMinimumLoading || !minimumGasPrice) return GAS_PRICE.toString();

    const suggestedGasPrice = new Token(minimumGasPrice).multipliedBy(GAS_PRICE_MULTIPLIER);
    return suggestedGasPrice.toString();
  }, [gasPriceMinimumLoading, minimumGasPrice]);
  return { suggestedGasPrice, loadGasPrices };
};
