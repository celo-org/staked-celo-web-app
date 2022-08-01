import { ReactElement } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
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
  <FloatingBox classes={classes}>
    <div className="flex justify-between items-center">
      <h2 className="text-sm">{titleChild}</h2>
      <div className="flex justify-between items-center">
        <TokenIcon token={token} />
        <span className="ml-3 text-sm">{token}</span>
      </div>
    </div>
    <div className="flex justify-start text-3xl my-2">{inputChild}</div>
    <div className="flex justify-start mb-2">{infoChild}</div>
  </FloatingBox>
);
