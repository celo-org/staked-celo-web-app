import { CeloChains } from "@celo/rainbowkit-celo";
import { Chain } from "@rainbow-me/rainbowkit";

export const resolveUnambiguousChainName = (chain: Chain): string => {
  if (chain.id == CeloChains.Alfajores.id) {
    return `${chain.name} Testnet`;
  }

  if (chain.id == CeloChains.Celo.id) {
    return `${chain.name} Mainnet`;
  }
  
  return chain.name;
}
