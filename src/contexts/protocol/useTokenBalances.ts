import { useCallback, useEffect, useMemo } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account';
import useAddresses from 'src/hooks/useAddresses';
import { Celo } from 'src/utils/tokens';
import { useContractRead } from 'wagmi';

export const useTokenBalances = () => {
  const addresses = useAddresses();
  const { data: _totalCeloBalance, refetch: loadTotalCeloBalance } = useContractRead({
    address: addresses.account,
    abi: AccountABI,
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
