import BigNumber from 'bignumber.js';
import { MIN_ROUNDED_VALUE, WEI_PER_UNIT } from 'src/config/consts';
import { fromWei as web3FromWei, toWei as web3ToWei } from 'web3-utils';

export type NumberT = BigNumber.Value;

export function fromWei(value: NumberT | null | undefined): BigNumber {
  if (!value) return new BigNumber(0);
  const flooredValue = new BigNumber(value).toFixed(0, BigNumber.ROUND_FLOOR);
  return new BigNumber(web3FromWei(flooredValue));
}

// Similar to fromWei above but rounds to set number of decimals
// with a minimum floor, configured per token
export function fromWeiRounded(
  value: NumberT | null | undefined,
  roundToZeroIfSmall = false
): number {
  if (!value) return 0;
  const flooredValue = new BigNumber(value).toFixed(0, BigNumber.ROUND_FLOOR);
  const amount = new BigNumber(web3FromWei(flooredValue));
  if (amount.isZero()) return 0;

  // If amount is less than min value
  if (amount.lt(MIN_ROUNDED_VALUE)) {
    if (roundToZeroIfSmall) return 0;
    else return MIN_ROUNDED_VALUE;
  }

  return amount.toNumber();
}

export function toWei(value: NumberT | null | undefined): BigNumber {
  if (!value) return new BigNumber(0);
  const valueString = value.toString();
  const components = valueString.split('.');
  if (components.length === 1) {
    return new BigNumber(web3ToWei(value.toString()));
  } else if (components.length === 2) {
    const trimmedFraction = components[1].substring(0, WEI_PER_UNIT.length - 1);
    return new BigNumber(web3ToWei(`${components[0]}.${trimmedFraction}`));
  } else {
    throw new Error(`Cannot convert ${valueString} to wei`);
  }
}
