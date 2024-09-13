import { celo as Celo } from 'viem/chains';
export function appendChainIdToLink(link: string, chainId: number) {
  if (chainId === Celo.id) {
    return link;
  } else {
    return `${link}?chainId=${chainId}`;
  }
}
