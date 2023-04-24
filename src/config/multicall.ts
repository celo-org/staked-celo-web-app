import { ChainId } from '@celo/react-celo';
import Multicall from '@dopex-io/web3-multicall';
import { MULTICALL_MAINNET, MULTICALL_TESTNET } from 'src/config/consts';
import { provider } from 'web3-core';

type Provider = provider;

export function getMultiCallForChain(chainId: number, provider: Provider) {
  const multicallConfig = chainId === ChainId.Mainnet ? MULTICALL_MAINNET : MULTICALL_TESTNET;
  return new Multicall({
    provider,
    chainId,
    multicallAddress: multicallConfig.address,
  });
}
