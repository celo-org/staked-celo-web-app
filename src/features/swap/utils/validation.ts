import { Token } from 'src/utils/tokens';
import { Mode } from '../types';

export const validateAmount = (amount: Token | null, balance: Token, mode: Mode) => {
  if (!amount) return null;
  if (amount.isLessThan(0)) return 'Amount cannot be negative';
  if (balance.isLessThan(amount)) {
    return `Not enough ${mode === 'stake' ? 'CELO' : 'stCELO'}`;
  }
  return null;
};
