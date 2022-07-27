import { DISPLAY_DECIMALS } from 'src/config/consts';

interface BalanceToolsProps {
  roundedBalance: number;
  onClickUseMax: () => () => void;
}

export const BalanceTools = (props: BalanceToolsProps) => {
  const { roundedBalance, onClickUseMax } = props;
  return (
    <div className="themed:balance-tools">
      <span className="themed:balance-tools__balance text-xs mr-2">
        {roundedBalance.toFixed(DISPLAY_DECIMALS)} balance &bull;&nbsp;
      </span>
      <button
        type="button"
        title="Use full balance"
        className="themed:balance-tools__max-button text-xs mr-2 underline font-medium"
        onClick={onClickUseMax()}
      >
        Max
      </button>
    </div>
  );
};
