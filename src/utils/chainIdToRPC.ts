import { Alfajores, Baklava, ChainId, Mainnet } from '@celo/react-celo';

const chainIdToRPC = {
  [ChainId.Mainnet]: Mainnet.rpcUrl,
  [ChainId.Alfajores]: Alfajores.rpcUrl,
  [ChainId.Baklava]: Baklava.rpcUrl,
};

export default chainIdToRPC;
