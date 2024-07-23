import { Alfajores, Baklava, Celo } from '@celo/rainbowkit-celo/chains';

const chainFromChainId = {
  [Celo.id]: Celo,
  [Alfajores.id]: Alfajores,
  [Baklava.id]: Baklava,
};

export default function chainIdToChain(
  chainId: number
): typeof Celo | typeof Alfajores | typeof Baklava {
  return chainFromChainId[chainId] || chainFromChainId[Celo.id];
}
