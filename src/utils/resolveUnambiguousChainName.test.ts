import { celo, celoAlfajores } from 'viem/chains';

import { resolveUnambiguousChainName } from 'src/utils/resolveUnambiguousChainName';
import { describe, expect, test } from 'vitest';

describe('resolveUnambiguousChainName', () => {
  test('it resolves name for mainnet', () => {
    expect(resolveUnambiguousChainName(celo)).toEqual('Celo Mainnet');
  });

  test('it resolves name for alfajores', () => {
    expect(resolveUnambiguousChainName(celoAlfajores)).toEqual('Alfajores Testnet');
  });

  test('it resolves default name', () => {
    expect(
      resolveUnambiguousChainName({
        name: 'Baklava',
        id: 62320,
        rpcUrls: {
          default: 'https://baklava-forno.celo-testnet.org',
        },
      })
    ).toEqual('Baklava');
  });
});
