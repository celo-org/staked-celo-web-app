export const WEI_PER_UNIT = '1000000000000000000'; // 1 Celo or Ether
export const DISPLAY_DECIMALS = 4;
export const INPUT_DECIMALS = 4;
export const MIN_ROUNDED_VALUE = 0.001;

export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE || '6000000000';
export const GAS_PRICE_MULTIPLIER = process.env.NEXT_PUBLIC_GAS_PRICE_MULTIPLIER || 1.2;
export const MAX_AMOUNT_THRESHOLD = '10000000000000000';

export const NEXT_PUBLIC_MANAGER_TESTNET_ADDRESS = '0xFfe124dde2b29fA848aD8caAEBE85651F0b5c406';
export const NEXT_PUBLIC_STAKED_CELO_TESTNET_ADDRESS = '0xD22E18556E43cb29D6d6172D4b33Fd2Edb629EF2';
export const NEXT_PUBLIC_ACCOUNT_TESTNET_ADDRESS = '0xd11CC172D802c1a94e81c5F432471bD34d1828A1';

export const NEXT_PUBLIC_MANAGER_MAINNET_ADDRESS = '0x0239b96D10a434a56CC9E09383077A0490cF9398';
export const NEXT_PUBLIC_STAKED_CELO_MAINNET_ADDRESS = '0xC668583dcbDc9ae6FA3CE46462758188adfdfC24';
export const NEXT_PUBLIC_ACCOUNT_MAINNET_ADDRESS = '0x4aAD04D41FD7fd495503731C5a2579e19054C432';

export const NEXT_PUBLIC_TESTNET_API_URL =
  'https://us-central1-staked-celo-bot.cloudfunctions.net/alfajores-functions';
export const NEXT_PUBLIC_MAINNET_API_URL =
  'https://us-central1-staked-celo-bot.cloudfunctions.net/mainnet-functions';

export const NEXT_PUBLIC_TWITTER_URL = 'https://twitter.com/CeloOrg';
export const NEXT_PUBLIC_DISCORD_URL = 'https://discord.com/invite/E9AqUQnWQE';
export const NEXT_PUBLIC_GITHUB_URL = 'https://github.com/celo-org/staked-celo-web-app';
export const NEXT_PUBLIC_DOCS_URL = 'https://docs.stcelo.xyz/';
export const NEXT_PUBLIC_PRIVACY_URL = 'https://clabs.co/privacy';
