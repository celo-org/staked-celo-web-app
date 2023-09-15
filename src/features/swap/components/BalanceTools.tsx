import { WidthTransition } from 'src/components/transitions/WidthTransition';
import { Mode } from 'src/types';
import { Token } from 'src/utils/tokens';

interface BalanceToolsProps {
  mode: Mode;
  balance: Token;
  onClickUseMax: () => void;
}

export const BalanceTools = ({ mode, balance, onClickUseMax }: BalanceToolsProps) => {
  return (
    <div className="text-color-secondary text-[15px] leading-[24px] font-regular">
      <WidthTransition id={mode}>
        {balance.displayAsBase()} balance
        {mode === Mode.unstake ? <span className="text-[12px]">*</span> : null}
      </WidthTransition>
      <span className="mx-[6px]">&bull;</span>
      <button type="button" title="Use full balance" className="underline" onClick={onClickUseMax}>
        Max
      </button>
    </div>
  );
};
