import { Alfajores, Baklava, Cannoli, Celo } from '@celo/rainbowkit-celo/chains';

const chainFromChainId = {
  [Celo.id]: Celo,
  [Alfajores.id]: Alfajores,
  [Baklava.id]: Baklava,
  [Cannoli.id]: Cannoli,
};

export default function chainIdToChain(
  chainId: number
): typeof Celo | typeof Alfajores | typeof Baklava | typeof Cannoli {
  return chainFromChainId[chainId] || chainFromChainId[Celo.id];
}
