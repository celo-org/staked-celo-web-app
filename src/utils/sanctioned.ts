import { OFAC_SANCTIONS_LIST_URL, SANCTIONED_ADDRESSES } from 'compliance-sdk';

const writeToCache = (url: string, data: string[]) =>
  localStorage.setItem(url, JSON.stringify({ ts: Date.now(), data }));

const readFromCache = (url: string) => {
  const cached = localStorage.getItem(url);
  if (cached) {
    return JSON.parse(cached) as { ts: number; data: string[] };
  }
  return null;
};

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
