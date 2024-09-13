import { Chain } from '@rainbow-me/rainbowkit';
import { celo, celoAlfajores } from 'viem/chains';

export const resolveUnambiguousChainName = (chain: Chain): string => {
  if (chain.id == celoAlfajores.id) {
    return `${chain.name} Testnet`;
  }

  if (chain.id == celo.id) {
    return `${chain.name} Mainnet`;
  }

  return chain.name;
};
