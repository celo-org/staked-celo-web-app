import { Celo } from '@celo/rainbowkit-celo/chains';
export function appendChainIdToLink(link: string, chainId: number) {
  if (chainId === Celo.id) {
    return link;
  } else {
    return `${link}?chainId=${chainId}`;
  }
}
