import Image from 'next/image';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CeloIcon from 'src/images/icons/token-celo.svg';
import stCeloIcon from 'src/images/icons/token-stcelo.svg';
import scssTransitions from 'src/styles/transitions.module.scss';
import { TokenType } from 'src/utils/tokens';

const { transitionDuration } = scssTransitions;

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
  <TransitionGroup mode="out-in" className="inline-flex relative">
    <CSSTransition key={token} timeout={parseInt(transitionDuration)} classNames="opacity">
      <span className="inline-flex">
        <Image
          src={tokenIcon[token]}
          alt={`${token} logo`}
          quality={quality}
          width={width}
          height={height}
        />
      </span>
    </CSSTransition>
  </TransitionGroup>
);
