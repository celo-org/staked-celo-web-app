import Image from 'next/image';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import CeloIcon from 'src/images/icons/token-celo.svg';
import stCeloIcon from 'src/images/icons/token-stcelo.svg';
import { TokenType } from 'src/utils/tokens';

const tokenIcon: { [key in TokenType]: any } = {
  CELO: CeloIcon,
  stCELO: stCeloIcon,
};

interface TokenIconProps {
  token: TokenType;
  quality?: number;
  width?: number;
  height?: number;
}

export const TokenIcon = ({ token, quality = 100, width = 32, height = 32 }: TokenIconProps) => (
  <OpacityTransition id={token} classes="inline-flex">
    <span className="inline-flex">
      <Image
        src={tokenIcon[token]}
        alt={`${token} logo`}
        quality={quality}
        width={width}
        height={height}
      />
    </span>
  </OpacityTransition>
);
