import { ChainId } from '@celo/react-celo';
import Multicall from '@dopex-io/web3-multicall';
import { MULTICALL_MAINNET, MULTICALL_TESTNET } from 'src/config/consts';
import logger from 'src/services/logger';
import { provider } from 'web3-core';

type Provider = provider;

export function getMultiCallForChain(chainId: number, provider: Provider) {
  const multicallConfig = chainId === ChainId.Mainnet ? MULTICALL_MAINNET : MULTICALL_TESTNET;
  logger.warn('starting multicall', chainId, multicallConfig);

  return new Multicall({
    provider,
    chainId,
    multicallAddress: multicallConfig.address,
    defaultBlock: multicallConfig.blockCreated,
  });
}
