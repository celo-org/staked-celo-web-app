import Registry from '@celo/abis/Registry.json';
import { getContract, PublicClient } from 'viem';

const REGISTRY_CONTRACT_ADDRESS = '0x000000000000000000000000000000000000ce10';
export default function getCeloRegistry(publicClient: PublicClient) {
  return getContract({
    address: REGISTRY_CONTRACT_ADDRESS,
    abi: Registry.abi,
    publicClient,
  });
}
