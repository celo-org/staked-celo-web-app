import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
import { createPublicClient, http } from 'viem';

const clients = {
  [Celo.id]: createPublicClient({
    chain: Celo,
    transport: http(),
  }),
  [Alfajores.id]: createPublicClient({
    chain: Alfajores,
    transport: http(),
  }),
} as const;

export default clients;
