import { ChainId } from '@celo/react-celo';

export function appendChainIdToLink(link: string, chainId: number) {
  if (chainId === ChainId.Mainnet) {
    return link;
  } else {
    return `${link}?chainId=${chainId}`;
  }
}
