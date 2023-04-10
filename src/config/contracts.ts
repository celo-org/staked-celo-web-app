import {
  ACCOUNT_MAINNET_ADDRESS,
  ACCOUNT_TESTNET_ADDRESS,
  MANAGER_MAINNET_ADDRESS,
  MANAGER_TESTNET_ADDRESS,
  STAKED_CELO_MAINNET_ADDRESS,
  STAKED_CELO_TESTNET_ADDRESS,
} from 'src/config/consts';

interface ContractAddresses {
  manager: string;
  stakedCelo: string;
  account: string;
}

export const mainnetAddresses: ContractAddresses = {
  manager: MANAGER_MAINNET_ADDRESS as string,
  stakedCelo: STAKED_CELO_MAINNET_ADDRESS as string,
  account: ACCOUNT_MAINNET_ADDRESS as string,
};

export const testnetAddresses: ContractAddresses = {
  manager: MANAGER_TESTNET_ADDRESS as string,
  stakedCelo: STAKED_CELO_TESTNET_ADDRESS as string,
  account: ACCOUNT_TESTNET_ADDRESS as string,
};
