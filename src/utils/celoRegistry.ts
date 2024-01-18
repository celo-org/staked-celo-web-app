import { registryABI } from '@celo/abis';

const REGISTRY_CONTRACT_ADDRESS = '0x000000000000000000000000000000000000ce10';
export default {
  address: REGISTRY_CONTRACT_ADDRESS,
  abi: registryABI,
} as const;
