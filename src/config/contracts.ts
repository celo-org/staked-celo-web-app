import {
  ACCOUNT_MAINNET_ADDRESS,
  ACCOUNT_TESTNET_ADDRESS,
  DEFAULT_GROUP_STRATEGY_MAINNET_ADDRESS,
  DEFAULT_GROUP_STRATEGY_TESTNET_ADDRESS,
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
import { Address } from 'viem';
import { celoAlfajores as Alfajores } from 'viem/chains';

interface ContractAddresses {
  manager: Address;
  stakedCelo: Address;
  account: Address;
  specificGroupStrategy: Address;
  defaultGroupStrategy: Address;
  groupHealth: Address;
  vote: Address;
}

export const mainnetAddresses: ContractAddresses = {
  manager: MANAGER_MAINNET_ADDRESS as Address,
  stakedCelo: STAKED_CELO_MAINNET_ADDRESS as Address,
  account: ACCOUNT_MAINNET_ADDRESS as Address,
  specificGroupStrategy: SPECIFIC_GROUP_STRATEGY_MAINNET_ADDRESS as Address,
  defaultGroupStrategy: DEFAULT_GROUP_STRATEGY_MAINNET_ADDRESS as Address,
  groupHealth: GROUP_HEALTH_MAINNET_ADDRESS as Address,
  vote: VOTE_MAINNET_ADDRESS as Address,
};

export const testnetAddresses: ContractAddresses = {
  manager: MANAGER_TESTNET_ADDRESS as Address,
  stakedCelo: STAKED_CELO_TESTNET_ADDRESS as Address,
  account: ACCOUNT_TESTNET_ADDRESS as Address,
  specificGroupStrategy: SPECIFIC_GROUP_STRATEGY_TESTNET_ADDRESS as Address,
  defaultGroupStrategy: DEFAULT_GROUP_STRATEGY_TESTNET_ADDRESS as Address,
  groupHealth: GROUP_HEALTH_TESTNET_ADDRESS as Address,
  vote: VOTE_TESTNET_ADDRESS as Address,
};

type ContractNames = keyof typeof mainnetAddresses;

export function getContractAddressForChain(chainId: number, contractName: ContractNames): Address {
  const address =
    chainId === Alfajores.id ? testnetAddresses[contractName] : mainnetAddresses[contractName];
  if (!address) {
    throw new Error(
      `No address for contract ${contractName} on chain ${chainId} ${chainId === Alfajores.id}`
    );
  }
  return address;
}
