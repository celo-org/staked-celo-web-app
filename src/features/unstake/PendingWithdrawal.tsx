import dayjs from 'dayjs';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { CeloWei, fromCeloWei } from 'src/utils/tokens';

interface PendingWithdrawalProps {
  amount: CeloWei;
  timestamp: string;
}

export const PendingWithdrawal = ({ amount, timestamp }: PendingWithdrawalProps) => {
  const celoAmount = fromCeloWei(amount);
  const date = dayjs.unix(parseInt(timestamp));

  return (
    <div className="flex flex-row mt-4 items-center">
      <TokenIcon token="CELO" />
      <div className="flex flex-col ml-3">
        <span className="text-2xl">{celoAmount.dp(DISPLAY_DECIMALS).toString()} CELO</span>
        <span className="text-secondary">
          {date.isBefore(dayjs())
            ? 'Claiming...'
            : `Available in ${dayjs.unix(parseInt(timestamp)).fromNow(true)}`}
        </span>
      </div>
    </div>
  );
};
