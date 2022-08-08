import dayjs from 'dayjs';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { Celo } from 'src/utils/tokens';

interface PendingWithdrawalsProps {
  pendingWithdrawals: PendingWithdrawalProps[];
}

export const PendingWithdrawals = ({ pendingWithdrawals }: PendingWithdrawalsProps) => (
  <div className="w-full mt-[48px]">
    <span className="font-semibold text-[14px] leading-[16px]">Currently unstaking</span>
    {pendingWithdrawals.map(({ amount, timestamp }) => (
      <PendingWithdrawal key={timestamp} amount={amount} timestamp={timestamp} />
    ))}
  </div>
);

interface PendingWithdrawalProps {
  amount: Celo;
  timestamp: string;
}

export const PendingWithdrawal = ({ amount, timestamp }: PendingWithdrawalProps) => {
  const date = dayjs.unix(parseInt(timestamp));

  return (
    <div className="flex flex-row mt-[18px] items-center">
      <TokenIcon token="CELO" />
      <div className="flex flex-col ml-[12px]">
        <span className="text-[21px] leading-[24px]">{amount.format()} CELO</span>
        <span className="text-secondary text-[14px] leading-[16px] mt-[4px]">
          {date.isBefore(dayjs())
            ? 'Claiming...'
            : `Available in ${dayjs.unix(parseInt(timestamp)).fromNow(true)}`}
        </span>
      </div>
    </div>
  );
};
