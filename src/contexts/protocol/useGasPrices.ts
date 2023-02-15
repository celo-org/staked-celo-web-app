import { useCallback, useEffect, useState } from 'react';
import { GAS_PRICE_MULTIPLIER } from 'src/config/consts';
import { useBlockchain } from 'src/hooks/useBlockchain';

export const useGasPrices = () => {
  const { suggestedGasPrice, loadSuggestedGasPrice } = useSuggestedGasPrice();

  const loadGasPrices = useCallback(async () => {
    await Promise.all([loadSuggestedGasPrice()]);
  }, [loadSuggestedGasPrice]);

  useEffect(() => {
    void loadGasPrices();
  }, [loadGasPrices]);

  return {
    suggestedGasPrice,
    loadGasPrices,
  };
};

const useSuggestedGasPrice = () => {
  const { gasPriceMinimumContract } = useBlockchain();
  const [suggestedGasPrice, setCurrentGasPrice] = useState('');

  const loadSuggestedGasPrice = useCallback(async () => {
    if (!gasPriceMinimumContract) return;
    const minimumGasPrice = await gasPriceMinimumContract.gasPriceMinimum();
    // plus 20% to account for network congestion.
    const suggestedGasPrice = minimumGasPrice.multipliedBy(GAS_PRICE_MULTIPLIER);
    setCurrentGasPrice(suggestedGasPrice.toString());
  }, [gasPriceMinimumContract]);

  return {
    suggestedGasPrice,
    loadSuggestedGasPrice,
  };
};
