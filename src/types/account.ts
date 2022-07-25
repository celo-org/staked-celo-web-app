import { CeloWei } from 'src/types/units';

export interface PendingWithdrawal {
  amount: CeloWei;
  timestamp: string;
}
