import { Alfajores, Baklava, ChainId, Mainnet } from '@celo/react-celo';

const chainIdForRPC = {
  [ChainId.Mainnet]: Mainnet.rpcUrl,
  [ChainId.Alfajores]: Alfajores.rpcUrl,
  [ChainId.Baklava]: Baklava.rpcUrl,
};

export default function chainIdToRPC(chainId: ChainId) {
  return chainIdForRPC[chainId] || chainIdForRPC[ChainId.Mainnet];
}
