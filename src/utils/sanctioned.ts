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

const RESTRICTED_COUNTRIES = new Set(['KP', 'IR', 'CU', 'SY']);

// https://www.iso.org/obp/ui/#iso:code:3166:UA although listed with UA prefix. the header/api recieved that and just used the number
const crimea = '43';
const luhansk = '09';
const donetska = '14';
//https://en.wikipedia.org/wiki/Russian-occupied_territories_of_Ukraine
const RESTRICED_SUBREGION: Record<string, Set<string>> = {
  UA: new Set([crimea, luhansk, donetska]),
};

export function isForbiddenLand(iso3166Country: string, iso3166Region: string) {
  const iso3166CountryUppercase = iso3166Country.toUpperCase();
  return (
    RESTRICTED_COUNTRIES.has(iso3166CountryUppercase) ||
    RESTRICED_SUBREGION[iso3166CountryUppercase]?.has(iso3166Region)
  );
}
