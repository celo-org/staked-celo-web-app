import { Celo } from 'src/types/units';

export interface PendingWithdrawal {
  amount: Celo;
  timestamp: string;
}
