import { useContext } from 'react';
import { BlockchainContext } from 'src/contexts/blockchain/BlockchainContext';
export type { TxCallbacks } from 'src/contexts/blockchain/BlockchainContext';

export function useBlockchain() {
  return useContext(BlockchainContext);
}
