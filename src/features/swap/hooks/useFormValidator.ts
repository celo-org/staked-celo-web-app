import { useCallback } from 'react';
import { Token, Wei } from 'src/utils/tokens';

export function useFormValidator<SourceWei extends Wei>(balance: SourceWei, token: Token) {
  return useCallback(
    (amount: Wei | undefined): string | undefined => {
      if (!amount) return;
      if (amount.isLessThan(0)) return 'Amount cannot be negative';
      if (balance.isLessThan(amount)) {
        return `Not enough ${token}`;
      }
      return;
    },
    [balance, token]
  );
}
