import { Alfajores, Baklava, Celo } from '@celo/rainbowkit-celo/chains';

const chainIdForRPC = {
  [Celo.id]: Celo.rpcUrls.default.http[0],
  [Alfajores.id]: Alfajores.rpcUrls.default.http[0],
  [Baklava.id]: Baklava.rpcUrls.default.http[0],
};

export default function chainIdToRPC(chainId: number) {
  return chainIdForRPC[chainId] || chainIdForRPC[Celo.id];
}
