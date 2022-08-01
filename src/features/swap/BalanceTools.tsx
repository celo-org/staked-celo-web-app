import { DISPLAY_DECIMALS } from 'src/config/consts';
import { fromCeloWei, fromStCeloWei } from 'src/formatters/amount';
import { CeloWei, StCeloWei } from 'src/types/units';

interface BalanceToolsProps {
  balance: CeloWei | StCeloWei;
  onClickUseMax: () => void;
}

export const BalanceTools = ({ balance, onClickUseMax }: BalanceToolsProps) => {
  const celoBalance = balance instanceof CeloWei ? fromCeloWei(balance) : fromStCeloWei(balance);

  return (
    <div className="text-secondary">
      <span className="text-xs mr-2">
        {celoBalance.toFixed(DISPLAY_DECIMALS)} balance &bull;&nbsp;
      </span>
      <button
        type="button"
        title="Use full balance"
        className="text-xs mr-2 underline font-medium"
        onClick={onClickUseMax}
      >
        Max
      </button>
    </div>
  );
};
