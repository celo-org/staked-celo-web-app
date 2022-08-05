import dayjs from 'dayjs';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { Celo } from 'src/utils/tokens';

interface PendingWithdrawalProps {
  amount: Celo;
  timestamp: string;
}

export const PendingWithdrawal = ({ amount, timestamp }: PendingWithdrawalProps) => {
  const date = dayjs.unix(parseInt(timestamp));

  return (
    <div className="flex flex-row mt-4 items-center">
      <TokenIcon token="CELO" />
      <div className="flex flex-col ml-3">
        <span className="text-2xl">{amount.format()} CELO</span>
        <span className="text-secondary">
          {date.isBefore(dayjs())
            ? 'Claiming...'
            : `Available in ${dayjs.unix(parseInt(timestamp)).fromNow(true)}`}
        </span>
      </div>
    </div>
  );
};
