import { useCallback, useEffect, useState } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import api from 'src/services/api';
import { PendingWithdrawal } from 'src/types/account';
import { Celo } from 'src/types/units';

export const useWithdrawalBot = (address: string | null) => {
  const { managerContract, accountContract } = useContracts();

  const finalizeWithdrawal = useCallback(async () => {
    if (!address) return;
    const [activeGroups, deprecatedGroups] = await Promise.all([
      managerContract.methods.getGroups().call(),
      managerContract.methods.getDeprecatedGroups().call(),
    ]);
    const groups = [...activeGroups, ...deprecatedGroups];
    for (const group of groups) {
      const scheduledWithdrawals = await accountContract.methods
        .scheduledWithdrawalsForGroupAndBeneficiary(group, address)
        .call();
      if (scheduledWithdrawals === '0') continue;
      await api.withdraw(address);
      return;
    }
  }, [address, managerContract, accountContract]);

  useEffect(() => {
    void finalizeWithdrawal();
    const intervalId = setInterval(finalizeWithdrawal, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [finalizeWithdrawal]);
};

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
