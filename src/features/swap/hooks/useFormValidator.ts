import { useCallback } from 'react';
import { Token } from 'src/utils/tokens';
import { Mode } from '../types';

export function useFormValidator<SourceToken extends Token>(balance: SourceToken, mode: Mode) {
  return useCallback(
    (amount: Token | undefined): string | undefined => {
      if (!amount) return;
      if (amount.isLessThan(0)) return 'Amount cannot be negative';
      if (balance.isLessThan(amount)) {
        return `Not enough ${mode === 'stake' ? 'CELO' : 'stCELO'}`;
      }
      return;
    },
    [balance, mode]
  );
}
