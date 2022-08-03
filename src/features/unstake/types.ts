import { Celo } from 'src/utils/tokens';

export interface PendingWithdrawal {
  amount: Celo;
  timestamp: string;
}
