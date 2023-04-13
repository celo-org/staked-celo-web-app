import {
  NEXT_PUBLIC_ACCOUNT_MAINNET_ADDRESS,
  NEXT_PUBLIC_ACCOUNT_TESTNET_ADDRESS,
  NEXT_PUBLIC_MANAGER_MAINNET_ADDRESS,
  NEXT_PUBLIC_MANAGER_TESTNET_ADDRESS,
  NEXT_PUBLIC_STAKED_CELO_MAINNET_ADDRESS,
  NEXT_PUBLIC_STAKED_CELO_TESTNET_ADDRESS,
} from 'src/config/consts';

interface ContractAddresses {
  defaultStrategy: string;
  manager: string;
  stakedCelo: string;
  account: string;
}

export const mainnetAddresses: ContractAddresses = {
  defaultStrategy: 'TODO_GET_ADDRESS',
  manager: NEXT_PUBLIC_MANAGER_MAINNET_ADDRESS as string,
  stakedCelo: NEXT_PUBLIC_STAKED_CELO_MAINNET_ADDRESS as string,
  account: NEXT_PUBLIC_ACCOUNT_MAINNET_ADDRESS as string,
};

export const testnetAddresses: ContractAddresses = {
  defaultStrategy: 'TODO_GET_ADDRESS',
  manager: NEXT_PUBLIC_MANAGER_TESTNET_ADDRESS as string,
  stakedCelo: NEXT_PUBLIC_STAKED_CELO_TESTNET_ADDRESS as string,
  account: NEXT_PUBLIC_ACCOUNT_TESTNET_ADDRESS as string,
};
