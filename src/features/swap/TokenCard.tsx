import { ReactElement } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { StakeToken } from 'src/features/swap/types';

export const TokenCard = (props: {
  inputChild?: number | string | ReactElement;
  titleChild?: number | string | ReactElement;
  infoChild?: number | string | ReactElement;
  token: StakeToken;
  classes?: string;
}) => (
  <FloatingBox classes={props.classes}>
    <div className="flex justify-between items-center">
      <h2 className="text-sm">{props.titleChild}</h2>
      <div className="flex justify-between items-center">
        <TokenIcon token={props.token} />
        <span className="ml-3 text-sm">{props.token}</span>
      </div>
    </div>
    <div className="flex justify-start text-3xl my-2">{props.inputChild}</div>
    <div className="flex justify-start mb-2">{props.infoChild}</div>
  </FloatingBox>
);
