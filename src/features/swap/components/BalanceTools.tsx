import { Wei } from 'src/utils/tokens';

interface BalanceToolsProps<SourceWei extends Wei> {
  balance: SourceWei;
  onClickUseMax: () => void;
}

export const BalanceTools = <SourceWei extends Wei>({
  balance,
  onClickUseMax,
}: BalanceToolsProps<SourceWei>) => {
  return (
    <div className="text-secondary text-[15px] leading-[24px] font-regular">
      <span>{balance.display()} balance</span>
      <span className="mx-[6px]">&bull;</span>
      <button type="button" title="Use full balance" className="underline" onClick={onClickUseMax}>
        Max
      </button>
    </div>
  );
};
