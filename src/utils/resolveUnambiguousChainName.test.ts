import { CeloChains } from "@celo/rainbowkit-celo";
import { resolveUnambiguousChainName } from "src/utils/resolveUnambiguousChainName";
import { describe, expect, test } from "vitest";

describe('resolveUnambiguousChainName', () => {
  test('it resolves name for mainnet', () => {
    expect(resolveUnambiguousChainName(CeloChains.Celo)).toEqual('Celo Mainnet');
  });

  test('it resolves name for alfajores', () => {
    expect(resolveUnambiguousChainName(CeloChains.Alfajores)).toEqual('Alfajores Testnet');
  });

  test('it resolves default name', () => {
    expect(resolveUnambiguousChainName(CeloChains.Baklava)).toEqual('Baklava');
  });
});
