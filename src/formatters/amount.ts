import BigNumber from 'bignumber.js';
import { MIN_ROUNDED_VALUE, WEI_PER_UNIT } from 'src/config/consts';
import { Celo, CeloWei, StCelo, StCeloWei } from 'src/types/units';
import { fromWei as web3FromWei, toWei as web3ToWei } from 'web3-utils';

function fromWei(value: BigNumber): string {
  if (!value) return '0';
  const flooredValue = value.toFixed(0, BigNumber.ROUND_FLOOR);
  return web3FromWei(flooredValue);
}

export function fromCeloWei(value: CeloWei): Celo {
  return new Celo(fromWei(value));
}

export function fromStCeloWei(value: StCeloWei): StCelo {
  return new StCelo(fromWei(value));
}

// Similar to fromWei above but rounds to set number of decimals
// with a minimum floor, configured per token
export function fromWeiRounded(value: CeloWei | StCeloWei, roundToZeroIfSmall = false): number {
  if (!value) return 0;
  const flooredValue = value.toFixed(0, BigNumber.ROUND_FLOOR);
  const amount = new BigNumber(web3FromWei(flooredValue));
  if (amount.isZero()) return 0;

  // If amount is less than min value
  if (amount.lt(MIN_ROUNDED_VALUE)) {
    if (roundToZeroIfSmall) return 0;
    else return MIN_ROUNDED_VALUE;
  }

  return amount.toNumber();
}

function toWei(value: BigNumber): string {
  if (!value) return '0';
  const valueString = value.toFixed();
  const components = valueString.split('.');
  if (components.length === 1) {
    return web3ToWei(value.toFixed());
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1);
    return web3ToWei(`${components[0]}.${trimmedFraction}`);
  } else {
    throw new Error(`Cannot convert ${valueString} to wei`);
  }
}

export function toCeloWei(value: Celo): CeloWei {
  return new CeloWei(toWei(value));
}

export function toStCeloWei(value: StCelo): StCeloWei {
  return new StCeloWei(toWei(value));
}
