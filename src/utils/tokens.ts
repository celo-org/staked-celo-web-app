import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS, WEI_PER_UNIT } from 'src/config/consts';
import { fromWei as web3FromToken, toWei as web3ToToken } from 'web3-utils';

export type TokenType = 'CELO' | 'stCELO';

export class Token extends BigNumber {
  constructor(value: any) {
    super(value instanceof BigNumber ? value.toFixed() : value);
  }

  format(): string {
    const value = web3FromToken(this.toFixed(0, BigNumber.ROUND_FLOOR));
    return new BigNumber(value)
      .toFormat(DISPLAY_DECIMALS, BigNumber.ROUND_FLOOR)
      .replace(/0*$/, '')
      .replace(/\.$/, '');
  }
}

export class Celo extends Token {
  private __tokenType: TokenType = 'CELO';
}

export class StCelo extends Token {
  private __tokenType: TokenType = 'stCELO';
}

export function toToken(value: string): Token {
  if (!value) return new Token('0');
  const components = value.split('.');
  if (components.length === 1) {
    return new Token(web3ToToken(value));
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1);
    return new Token(web3ToToken(`${components[0]}.${trimmedFraction}`));
  } else {
    throw new Error(`Cannot convert ${value} to wei`);
  }
}
