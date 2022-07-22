import { useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import { PendingWithdrawal } from 'src/types/account';
import { Celo } from 'src/types/units';

export const useWithdrawals = (address: string | null) => {
  const { accountContract } = useContracts();

  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);
  const loadPendingWithdrawals = useCallback(async () => {
    const { values = [], timestamps = [] } =
      (await accountContract.methods.getPendingWithdrawals(address).call({ from: address })) || {};

    setPendingWithdrawals(
      values.map((amount: string, index: number) => ({
        amount: new Celo(amount),
        timestamp: timestamps[index],
      }))
    );
  }, [accountContract, address]);

  useEffect(() => {
    if (!address) return;
    void loadPendingWithdrawals();
  }, [loadPendingWithdrawals, address]);

  return {
    pendingWithdrawals,
  };
};
