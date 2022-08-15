import { ReactElement } from 'react';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { WidthTransition } from 'src/components/transitions/WidthTransition';
import { TokenType } from 'src/utils/tokens';

interface TokenCardProps {
  token: TokenType;
  inputChild?: number | string | ReactElement;
  titleChild?: number | string | ReactElement;
  infoChild?: number | string | ReactElement;
  classes?: string;
}

export const TokenCard = ({
  inputChild,
  titleChild,
  infoChild,
  token,
  classes,
}: TokenCardProps) => {
  return (
    <div className={`flex flex-col justify-between w-full h-[184px] p-[24px] ${classes}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] leading-[24px] font-medium">{titleChild}</h2>
        <div className="flex justify-between items-center">
          <TokenIcon width={24} height={24} token={token} />
          <div className="ml-[8px]">
            <WidthTransition id={token}>
              <span className="text-[15px] leading-[24px]">{token}</span>
            </WidthTransition>
          </div>
        </div>
      </div>
      <div className="flex justify-start text-[32px] leading-[40px] text-left">
        <OpacityTransition id={token}>
          <span>{inputChild}</span>
        </OpacityTransition>
      </div>
      <div className="flex justify-start">{infoChild}</div>
    </div>
  );
};
