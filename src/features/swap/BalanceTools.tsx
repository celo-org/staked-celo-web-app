import { DISPLAY_DECIMALS } from 'src/config/consts';
import { CeloWei, fromCeloWei, fromStCeloWei, StCeloWei } from 'src/utils/tokens';

interface BalanceToolsProps {
  balance: CeloWei | StCeloWei;
  onClickUseMax: () => void;
}

export const BalanceTools = ({ balance, onClickUseMax }: BalanceToolsProps) => {
  const celoBalance = balance instanceof CeloWei ? fromCeloWei(balance) : fromStCeloWei(balance);

  return (
    <div className="text-secondary text-[15px] leading-[24px] font-regular">
      <span>{celoBalance.toFixed(DISPLAY_DECIMALS)} balance</span>
      <span className="mx-[6px]">&bull;</span>
      <button type="button" title="Use full balance" className="underline" onClick={onClickUseMax}>
        Max
      </button>
    </div>
  );
};
