import { Alfajores, Mainnet, Network } from '@celo/react-celo';

const { NODE_ENV } = process.env;

export const networkConfig: Network = NODE_ENV === 'production' ? Mainnet : Alfajores;

