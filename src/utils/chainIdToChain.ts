import { ChainIds } from 'src/utils/clients';
import { celoAlfajores as Alfajores, celo as Celo } from 'viem/chains';

const chainFromChainId = {
  [Celo.id]: Celo,
  [Alfajores.id]: Alfajores,
};

export default function chainIdToChain(chainId: ChainIds): typeof Celo | typeof Alfajores {
  return chainFromChainId[chainId] || chainFromChainId[Celo.id];
}
