import { Alfajores, Mainnet, Network, SupportedProviders } from '@celo/react-celo';

const { NODE_ENV } = process.env;

export const networkConfig: Network = NODE_ENV === 'production' ? Mainnet : Alfajores;

export const supportedProviders: SupportedProviders[] = [
  SupportedProviders.CeloExtensionWallet,
  SupportedProviders.MetaMask,
  SupportedProviders.Valora,
  SupportedProviders.WalletConnect,
];
