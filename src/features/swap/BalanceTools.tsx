import { DISPLAY_DECIMALS } from 'src/config/consts';

interface BalanceToolsProps {
  roundedBalance: number;
  onClickUseMax: () => () => void;
}

export const BalanceTools = (props: BalanceToolsProps) => {
  const { roundedBalance, onClickUseMax } = props;
  return (
    <div>
      <span className="text-xs text-gray-500 mr-2">
        {roundedBalance.toFixed(DISPLAY_DECIMALS)} balance
      </span>
      &bull;&nbsp;
      <button
        type="button"
        title="Use full balance"
        className="text-xs text-gray-500 mr-2 underline font-medium"
        onClick={onClickUseMax()}
      >
        Max
      </button>
    </div>
  );
};
