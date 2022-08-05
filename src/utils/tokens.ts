import BigNumber from 'bignumber.js';
import { DISPLAY_DECIMALS, WEI_PER_UNIT } from 'src/config/consts';
import { fromWei as web3FromWei, toWei as web3ToWei } from 'web3-utils';

export type Token = 'CELO' | 'stCELO';

export class Wei extends BigNumber {
  constructor(value: any) {
    super(value instanceof BigNumber ? value.toFixed() : value);
  }

  format(): string {
    return new BigNumber(fromWei(this))
      .toFormat(DISPLAY_DECIMALS, BigNumber.ROUND_FLOOR)
      .replace(/0*$/, '')
      .replace(/\.$/, '');
  }
}

export class CeloWei extends Wei {
  private __tokenType = 'CeloWei';
}

export class StCeloWei extends Wei {
  private __tokenType = 'StCeloWei';
}

function fromWei(value: BigNumber): string {
  if (!value) return '0';
  const flooredValue = value.toFixed(0, BigNumber.ROUND_FLOOR);
  return web3FromWei(flooredValue);
}

export function toWei(value: string): Wei {
  if (!value) return new Wei('0');
  const components = value.split('.');
  if (components.length === 1) {
    return new Wei(web3ToWei(value));
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1);
    return new Wei(web3ToWei(`${components[0]}.${trimmedFraction}`));
  } else {
    throw new Error(`Cannot convert ${value} to wei`);
  }
}
