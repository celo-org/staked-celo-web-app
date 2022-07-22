import { useCallback } from 'react';
import { StakeToken } from 'src/features/swap/types';
import { toCeloWei } from 'src/formatters/amount';
import { Celo, CeloWei, StCeloWei } from 'src/types/units';

export function useFormValidator(balance: CeloWei | StCeloWei, token: StakeToken) {
  return useCallback(
    (amount: number | undefined): string | undefined => {
      if (!amount) return 'Amount Required';
      if (amount < 0) return 'Amount cannot be negative';
      if (balance.isLessThan(toCeloWei(new Celo(amount)))) {
        return `Not enough ${token}`;
      }

      return undefined;
    },
    [balance, token]
  );
}
