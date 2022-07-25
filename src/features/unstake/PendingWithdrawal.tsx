import dayjs from 'dayjs';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { fromCeloWei } from 'src/formatters/amount';
import { CeloWei } from 'src/types/units';

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
        <span className="text-white text-2xl font-light">
          {celoAmount.dp(DISPLAY_DECIMALS).toString()} CELO
        </span>
        <span className="text-gray-400">
          {date.isBefore(dayjs())
            ? 'Claiming...'
            : `Available in ${dayjs.unix(parseInt(timestamp)).fromNow(true)}`}
        </span>
      </div>
    </div>
  );
};
