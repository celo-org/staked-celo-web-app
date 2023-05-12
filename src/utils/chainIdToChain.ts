import { celo, celoAlfajores, celoCannoli } from 'wagmi/chains';

const chainIdForChain = {
  [celo.id]: celo,
  [celoAlfajores.id]: celoAlfajores,
  [celoCannoli.id]: celoCannoli,
};

export default function chainIdToChain(
  chainId: number
): typeof celo | typeof celoAlfajores | typeof celoCannoli {
  // @ts-expect-error
  return chainIdForChain[chainId] || chainIdForChain[celo.id];
}
