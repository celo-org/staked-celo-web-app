import { Mode } from 'src/types';
import { Token } from 'src/utils/tokens';

export const validateAmount = (amount: Token | null, balance: Token, mode: Mode) => {
  if (!amount) return null;
  if (amount.isLessThan(0)) return 'Amount cannot be negative';
  if (balance.isLessThan(amount)) {
    return `Not enough ${mode === Mode.stake ? 'CELO' : 'stCELO'}`;
  }
  return null;
};
