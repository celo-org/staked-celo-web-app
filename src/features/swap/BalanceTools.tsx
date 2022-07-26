import { DISPLAY_DECIMALS } from 'src/config/consts';

interface BalanceToolsProps {
  roundedBalance: number;
  onClickUseMax: () => () => void;
}

export const BalanceTools = (props: BalanceToolsProps) => {
  const { roundedBalance, onClickUseMax } = props;
  return (
    <div className="c-balance-tools">
      <span className="c-balance-tools__balance text-xs mr-2">
        {roundedBalance.toFixed(DISPLAY_DECIMALS)} balance &bull;&nbsp;
      </span>
      <button
        type="button"
        title="Use full balance"
        className="text-xs mr-2 underline font-medium"
        onClick={onClickUseMax()}
      >
        Max
      </button>
    </div>
  );
};
