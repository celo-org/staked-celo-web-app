import Image from 'next/image';
import { ReactElement } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { StakeToken } from 'src/features/swap/types';
import Celo from 'src/images/icons/CELO.svg';
import stCelo from 'src/images/icons/stCELO.svg';

const tokenIcon: { [key in StakeToken]: any } = {
  CELO: Celo,
  stCELO: stCelo,
};

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
        <Image
          src={tokenIcon[props.token]}
          alt={`${props.token} logo`}
          quality={100}
          width={32}
          height={32}
        />
        <span className="ml-3 text-sm">{props.token}</span>
      </div>
    </div>
    <div className="flex justify-start text-xl font-mono">{props.inputChild}</div>
    <div className="flex justify-start my-2">{props.infoChild}</div>
  </FloatingBox>
);
