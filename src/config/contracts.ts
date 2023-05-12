import {
  ACCOUNT_MAINNET_ADDRESS,
  ACCOUNT_TESTNET_ADDRESS,
  GROUP_HEALTH_MAINNET_ADDRESS,
  GROUP_HEALTH_TESTNET_ADDRESS,
  MANAGER_MAINNET_ADDRESS,
  MANAGER_TESTNET_ADDRESS,
  SPECIFIC_GROUP_STRATEGY_MAINNET_ADDRESS,
  SPECIFIC_GROUP_STRATEGY_TESTNET_ADDRESS,
  STAKED_CELO_MAINNET_ADDRESS,
  STAKED_CELO_TESTNET_ADDRESS,
  VOTE_MAINNET_ADDRESS,
  VOTE_TESTNET_ADDRESS,
} from 'src/config/consts';
import { celoAlfajores } from 'wagmi/chains';

interface ContractAddresses {
  manager: `0x${string}`;
  stakedCelo: `0x${string}`;
  account: `0x${string}`;
  specificGroupStrategy: `0x${string}`;
  groupHealth: `0x${string}`;
  vote: `0x${string}`;
}

export const mainnetAddresses: ContractAddresses = {
  manager: MANAGER_MAINNET_ADDRESS as `0x${string}`,
  stakedCelo: STAKED_CELO_MAINNET_ADDRESS as `0x${string}`,
  account: ACCOUNT_MAINNET_ADDRESS as `0x${string}`,
  specificGroupStrategy: SPECIFIC_GROUP_STRATEGY_MAINNET_ADDRESS as `0x${string}`,
  groupHealth: GROUP_HEALTH_MAINNET_ADDRESS as `0x${string}`,
  vote: VOTE_MAINNET_ADDRESS as `0x${string}`,
};

export const testnetAddresses: ContractAddresses = {
  manager: MANAGER_TESTNET_ADDRESS as `0x${string}`,
  stakedCelo: STAKED_CELO_TESTNET_ADDRESS as `0x${string}`,
  account: ACCOUNT_TESTNET_ADDRESS as `0x${string}`,
  specificGroupStrategy: SPECIFIC_GROUP_STRATEGY_TESTNET_ADDRESS as `0x${string}`,
  groupHealth: GROUP_HEALTH_TESTNET_ADDRESS as `0x${string}`,
  vote: VOTE_TESTNET_ADDRESS as `0x${string}`,
};

type ContractNames = keyof typeof mainnetAddresses;

export function getContractAddressForChain(chainId: number, contractName: ContractNames): string {
  const address =
    chainId === celoAlfajores.id ? testnetAddresses[contractName] : mainnetAddresses[contractName];
  if (!address) {
    throw new Error(
      `No address for contract ${contractName} on chain ${chainId} ${chainId === celoAlfajores.id}`
    );
  }
  return address;
}
