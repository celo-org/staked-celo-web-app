import { ReactElement } from 'react';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { StakeToken } from 'src/features/swap/types';

interface TokenCardProps {
  inputChild?: number | string | ReactElement;
  titleChild?: number | string | ReactElement;
  infoChild?: number | string | ReactElement;
  token: StakeToken;
  classes?: string;
}

export const TokenCard = ({
  inputChild,
  titleChild,
  infoChild,
  token,
  classes,
}: TokenCardProps) => (
  <div className={`flex flex-col justify-between w-full h-[184px] p-[24px] ${classes}`}>
    <div className="flex justify-between items-center">
      <h2 className="text-[15px] leading-[24px] font-medium">{titleChild}</h2>
      <div className="flex justify-between items-center">
        <TokenIcon width={24} height={24} token={token} />
        <span className="ml-[8px] text-[15px] leading-[24px]">{token}</span>
      </div>
    </div>
    <div className="flex justify-start text-[32px] leading-[40px] text-left">{inputChild}</div>
    <div className="flex justify-start">{infoChild}</div>
  </div>
);
