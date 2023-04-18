import { ChainId } from '@celo/react-celo'
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
} from 'src/config/consts';

interface ContractAddresses {
  manager: string;
  stakedCelo: string;
  account: string;
  specificGroupStrategy: string;
  groupHealth: string
}

export const mainnetAddresses: ContractAddresses = {
  manager: MANAGER_MAINNET_ADDRESS as string,
  stakedCelo: STAKED_CELO_MAINNET_ADDRESS as string,
  account: ACCOUNT_MAINNET_ADDRESS as string,
  specificGroupStrategy: SPECIFIC_GROUP_STRATEGY_MAINNET_ADDRESS as string,
  groupHealth: GROUP_HEALTH_MAINNET_ADDRESS as string,
};

export const testnetAddresses: ContractAddresses = {
  manager: MANAGER_TESTNET_ADDRESS as string,
  stakedCelo: STAKED_CELO_TESTNET_ADDRESS as string,
  account: ACCOUNT_TESTNET_ADDRESS as string,
  specificGroupStrategy: SPECIFIC_GROUP_STRATEGY_TESTNET_ADDRESS as string,
  groupHealth: GROUP_HEALTH_TESTNET_ADDRESS as string,
};


type ContractNames = keyof typeof mainnetAddresses

export function getContractAddressForChain(chainId: number, contractName: ContractNames): string {
  const address =
    chainId === ChainId.Alfajores ? testnetAddresses[contractName] : mainnetAddresses[contractName];
  if (!address) {
    throw new Error(
      `No address for contract ${contractName} on chain ${chainId} ${chainId === ChainId.Alfajores}`
    );
  }
  return address;
}
