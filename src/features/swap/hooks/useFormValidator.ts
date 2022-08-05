import { useCallback } from 'react';
import { Celo, CeloWei, StCeloWei, toCeloWei, Token } from 'src/utils/tokens';

export function useFormValidator(balance: CeloWei | StCeloWei, token: Token) {
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
