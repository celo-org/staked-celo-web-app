import { celoAlfajores as Alfajores, celo as Celo } from 'viem/chains';

const chainIdForRPC = {
  [Celo.id]: Celo.rpcUrls.default.http[0],
  [Alfajores.id]: Alfajores.rpcUrls.default.http[0],
};

export default function chainIdToRPC(chainId: typeof Celo.id | typeof Alfajores.id) {
  return chainIdForRPC[chainId] || chainIdForRPC[Celo.id];
}
