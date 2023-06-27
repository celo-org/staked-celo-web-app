import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS, WEI_PER_UNIT } from 'src/config/consts';
import { fromWei, toWei } from 'web3-utils';

export type TokenType = 'CELO' | 'stCELO' | 'cUSD';

export class Token extends BigNumber {
  constructor(value: any) {
    if (value instanceof BigNumber) {
      super(value.toFixed());
    } else if (value && typeof value.value !== 'undefined') {
      // returnvalue from viem balanceOf looks like that:
      // { decimals: 18, formatted: "1", symbol: "CELO", value: 1n }
      super(value.value);
    } else {
      super(value);
    }
  }

  displayAsBase(skipTrailingZeroes = false): string {
    const base = this.convertToBase().toFormat(DISPLAY_DECIMALS, BigNumber.ROUND_FLOOR);
    if (!skipTrailingZeroes) return base;
    return base.replace(/0*$/, '').replace(/\.$/, '');
  }

  convertToBase(): BigNumber {
    const baseValue = fromWei(this.toFixed(0, BigNumber.ROUND_FLOOR));
    return new BigNumber(baseValue);
  }

  toBigInt(): bigint {
    return BigInt(this.toNumber());
  }
}

export class Celo extends Token {
  private __tokenType: TokenType = 'CELO';
}

export class StCelo extends Token {
  private __tokenType: TokenType = 'stCELO';
}

export class CeloUSD extends Token {
  private __tokenType: TokenType = 'cUSD';
}

export function toToken(value: string): Token {
  if (!value) return new Token('0');
  const components = value.split('.');
  if (components.length === 1) {
    return new Token(toWei(value));
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1);
    return new Token(toWei(`${components[0]}.${trimmedFraction}`));
  } else {
    throw new Error(`Cannot convert ${value} to wei`);
  }
}
