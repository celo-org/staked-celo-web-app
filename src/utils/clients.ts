import { createPublicClient, http } from 'viem';
import { celoAlfajores as Alfajores, celo as Celo } from 'viem/chains';

export type ChainIds = typeof Celo.id | typeof Alfajores.id;

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
