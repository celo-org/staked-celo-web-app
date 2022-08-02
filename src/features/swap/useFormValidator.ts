import { useCallback } from 'react';
import { StakeToken } from 'src/features/swap/types';
import { Celo, CeloWei, StCeloWei } from 'src/types/units';
import { toCeloWei } from 'src/utils/tokens';

export function useFormValidator(balance: CeloWei | StCeloWei, token: StakeToken) {
  return useCallback(
    (amount: number | undefined): string | undefined => {
      if (!amount) return;
      if (amount < 0) return 'Amount cannot be negative';
      if (balance.isLessThan(toCeloWei(new Celo(amount)))) {
        return `Not enough ${token}`;
      }
      return;
    },
    [balance, token]
  );
}
