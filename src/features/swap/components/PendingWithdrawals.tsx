import dayjs from 'dayjs';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
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
  const isClaiming = date.isBefore(dayjs());
  const isPastClaimingDate = date.isBefore(dayjs().subtract(5, 'minutes'));

  return (
    <div className="flex w-full flex-row mt-[18px] items-center justify-between">
      <div className="inline-flex">
        <TokenIcon token="CELO" />
        <div className="flex flex-col ml-[12px]">
          <span className="text-[21px] leading-[24px]">{amount.displayAsBase()} CELO</span>
          <span className="text-color-secondary text-[14px] leading-[16px] mt-[4px]">
            {isClaiming
              ? isPastClaimingDate
                ? 'Still claiming...'
                : 'Claiming takes about 5 mins...'
              : `Available in ${dayjs.unix(parseInt(timestamp)).fromNow(true)}`}
          </span>
        </div>
      </div>
      {isClaiming ? (
        <ThemedIcon
          name="spinner-contrast"
          alt="spinner"
          width={32}
          height={32}
          classes="animate-spin"
        />
      ) : null}
    </div>
  );
};
