export const WEI_PER_UNIT = '1000000000000000000'; // 1 Celo or Ether
export const DISPLAY_DECIMALS = 4;
export const INPUT_DECIMALS = 4;
export const MIN_ROUNDED_VALUE = 0.001;

export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE || '6000000000';
export const GAS_PRICE_MULTIPLIER = process.env.NEXT_PUBLIC_GAS_PRICE_MULTIPLIER || 1.2;
export const MAX_AMOUNT_THRESHOLD = '10000000000000000';

export const MANAGER_TESTNET_ADDRESS = '0xFfe124dde2b29fA848aD8caAEBE85651F0b5c406';
export const STAKED_CELO_TESTNET_ADDRESS = '0xD22E18556E43cb29D6d6172D4b33Fd2Edb629EF2';
export const ACCOUNT_TESTNET_ADDRESS = '0xd11CC172D802c1a94e81c5F432471bD34d1828A1';
export const GROUP_HEALTH_TESTNET_ADDRESS = '0x94322926267ae0321F7B80DbA40eFba5DE9B5aA9';
export const SPECIFIC_GROUP_STRATEGY_TESTNET_ADDRESS = '0x5028a7061c9860D67f9752d6e0cD1931404fc45b';
export const DEFAULT_GROUP_STRATEGY_TESTNET_ADDRESS = '0x996c3449cae68D4f8e998F1186c8169c59b6f030';
export const VOTE_TESTNET_ADDRESS = '0xB2f2bcAd9C99589a8e19E9C17207599318dBc181';

export const MANAGER_MAINNET_ADDRESS = '0x0239b96D10a434a56CC9E09383077A0490cF9398';
export const STAKED_CELO_MAINNET_ADDRESS = '0xC668583dcbDc9ae6FA3CE46462758188adfdfC24';
export const ACCOUNT_MAINNET_ADDRESS = '0x4aAD04D41FD7fd495503731C5a2579e19054C432';

export const TESTNET_API_URL =
  'https://us-central1-staked-celo-bot.cloudfunctions.net/alfajores-functions';
export const MAINNET_API_URL =
  'https://us-central1-staked-celo-bot.cloudfunctions.net/mainnet-functions';

export const EXPLORER_GRAPH_MAINNET_URL = 'https://explorer.celo.org/mainnet/graphiql';
export const EXPLORER_GRAPH_ALFAJORES_URL = 'https://explorer.celo.org/alfajores/graphiql';
export const EXPLORER_MAINNET_URL = 'https://explorer.celo.org/mainnet';
export const EXPLORER_ALFAJORES_URL = 'https://explorer.celo.org/alfajores';

export const TWITTER_URL = 'https://twitter.com/CeloOrg';
export const DISCORD_URL = 'https://discord.com/invite/E9AqUQnWQE';
export const GITHUB_URL = 'https://github.com/celo-org/staked-celo-web-app';
export const DOCS_URL = 'https://docs.stcelo.xyz/';
export const PRIVACY_URL = 'https://clabs.co/privacy';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
