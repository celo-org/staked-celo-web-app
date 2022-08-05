import { Wei } from 'src/utils/tokens';

interface BalanceToolsProps {
  balance: Wei;
  onClickUseMax: () => void;
}

export const BalanceTools = ({ balance, onClickUseMax }: BalanceToolsProps) => {
  return (
    <div className="text-secondary text-[15px] leading-[24px] font-regular">
      <span>{balance.format()} balance</span>
      <span className="mx-[6px]">&bull;</span>
      <button type="button" title="Use full balance" className="underline" onClick={onClickUseMax}>
        Max
      </button>
    </div>
  );
};
