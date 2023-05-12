import Multicall from '@dopex-io/web3-multicall';
import { MULTICALL_MAINNET, MULTICALL_TESTNET } from 'src/config/consts';
import { celo } from 'wagmi/chains';
import { provider } from 'web3-core';

type Provider = provider;

export function getMultiCallForChain(chainId: number, provider: Provider) {
  const multicallConfig = chainId === celo.id ? MULTICALL_MAINNET : MULTICALL_TESTNET;
  return new Multicall({
    provider,
    chainId,
    multicallAddress: multicallConfig.address,
  });
}
