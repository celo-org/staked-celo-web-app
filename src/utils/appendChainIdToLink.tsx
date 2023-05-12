import { celo } from 'wagmi/chains';
export function appendChainIdToLink(link: string, chainId: number) {
  if (chainId === celo.id) {
    return link;
  } else {
    return `${link}?chainId=${chainId}`;
  }
}
