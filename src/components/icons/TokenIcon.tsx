import Image from 'next/image';
import CeloIcon from 'src/images/icons/token-celo.svg';
import stCeloIcon from 'src/images/icons/token-stcelo.svg';
import { Token } from 'src/utils/tokens';

const tokenIcon: { [key in Token]: any } = {
  CELO: CeloIcon,
  stCELO: stCeloIcon,
};

interface TokenIconProps {
  token: Token;
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
