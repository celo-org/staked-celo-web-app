import { useCallback, useEffect, useMemo } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo } from 'src/utils/tokens';
import { useReadContract } from 'wagmi';

export const useTokenBalances = () => {
  const { accountContract } = useBlockchain();
  const { data: _totalCeloBalance, refetch: loadTotalCeloBalance } = useReadContract({
    ...accountContract,
    functionName: 'getTotalCelo',
  });
  const totalCeloBalance = useMemo(() => new Celo(_totalCeloBalance || 0), [_totalCeloBalance]);

  const loadTokenBalances = useCallback(async () => {
    await Promise.all([loadTotalCeloBalance()]);
  }, [loadTotalCeloBalance]);

  useEffect(() => {
    void loadTokenBalances();
  }, [loadTokenBalances]);

  return {
    totalCeloBalance,
    loadTokenBalances,
  };
};
