import Image from 'next/image';
import { StakeToken } from 'src/features/swap/types';
import CeloIcon from 'src/images/icons/CELO.svg';
import stCeloIcon from 'src/images/icons/stCELO.svg';

const tokenIcon: { [key in StakeToken]: any } = {
  CELO: CeloIcon,
  stCELO: stCeloIcon,
};

interface TokenIconProps {
  token: StakeToken;
  quality?: number;
  width?: number;
  height?: number;
}

export const TokenIcon = ({ token, quality = 100, width = 32, height = 32 }: TokenIconProps) => (
  <Image
    src={tokenIcon[token]}
    alt={`${token} logo`}
    quality={quality}
    width={width}
    height={height}
  />
);
