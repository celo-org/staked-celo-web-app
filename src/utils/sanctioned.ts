import { OFAC_SANCTIONS_LIST_URL, SANCTIONED_ADDRESSES } from 'compliance-sdk';
import { readFromCache, writeToCache } from './localSave';

const DAY = 24 * 60 * 60 * 1000;

export async function isSanctionedAddress(address: string): Promise<boolean> {
  const cache = readFromCache(OFAC_SANCTIONS_LIST_URL);
  if (cache && cache.ts + DAY > Date.now()) {
    return cache.data.includes(address.toLowerCase());
  }

  const sanctionedAddresses: string[] = await fetch(OFAC_SANCTIONS_LIST_URL)
    .then((x) => x.json())
    .catch(() => SANCTIONED_ADDRESSES); // fallback if github is down or something.

  if (process.env.NODE_ENV !== 'production' && process.env.TEST_SANCTIONED_ADDRESS) {
    sanctionedAddresses.push(process.env.TEST_SANCTIONED_ADDRESS);
  }

  writeToCache(
    OFAC_SANCTIONS_LIST_URL,
    sanctionedAddresses.map((x) => x.toLowerCase())
  );

  return isSanctionedAddress(address);
}

export const RESTRICTED_COUNTRIES = new Set(['KP', 'IR', 'CU', 'SY']);

const crimea = 'UA-43';
const luhansk = 'UA-09';
const donetska = 'UA-14';
// https://www.iso.org/obp/ui/#iso:code:3166:UA
//https://en.wikipedia.org/wiki/Russian-occupied_territories_of_Ukraine
export const RESTRICED_SUBREGION = {
  UA: new Set([crimea, luhansk, donetska]),
};
