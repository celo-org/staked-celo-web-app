import { useCallback } from 'react';
import { Wei } from 'src/utils/tokens';
import { Mode } from '../types';

export function useFormValidator<SourceWei extends Wei>(balance: SourceWei, mode: Mode) {
  return useCallback(
    (amount: Wei | undefined): string | undefined => {
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
