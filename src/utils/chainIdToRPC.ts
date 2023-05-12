import { celo, celoAlfajores, celoCannoli } from 'wagmi/chains';

const chainIdForRPC = {
  [celo.id]: celo.rpcUrls.default.http[0],
  [celoAlfajores.id]: celoAlfajores.rpcUrls.default.http[0],
  [celoCannoli.id]: celoCannoli.rpcUrls.default.http[0],
};

export default function chainIdToRPC(chainId: number) {
  // @ts-expect-error
  return chainIdForRPC[chainId] || chainIdForRPC[celo.id];
}
