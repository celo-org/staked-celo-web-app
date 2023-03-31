import { WidthTransition } from 'src/components/transitions/WidthTransition';
import { Token } from 'src/utils/tokens';
import { Mode } from 'src/types';

interface BalanceToolsProps {
  mode: Mode;
  balance: Token;
  onClickUseMax: () => void;
}

export const BalanceTools = ({ mode, balance, onClickUseMax }: BalanceToolsProps) => {
  return (
    <div className="text-color-secondary text-[15px] leading-[24px] font-regular">
      <WidthTransition id={mode}>{balance.displayAsBase()} balance</WidthTransition>
      <span className="mx-[6px]">&bull;</span>
      <button type="button" title="Use full balance" className="underline" onClick={onClickUseMax}>
        Max
      </button>
    </div>
  );
};
