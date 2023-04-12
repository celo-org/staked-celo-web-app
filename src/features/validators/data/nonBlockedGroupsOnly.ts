import { ChainId } from '@celo/react-celo';
import SpecificGroupStrategyABI from 'src/blockchain/ABIs/SpecificGroupStrategy.json';
import { SpecificGroupStrategy } from 'src/blockchain/types';
import { getContractAddressForChain } from 'src/config/contracts';
import { getMultiCallForChain } from 'src/config/multicall';
import Web3 from 'web3';
import { HttpProvider } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { getGoodAddresses } from './getGoodAddresses';

// once complete will return all the addresses of groups that are not blocked
export async function nonBlockedGroupsOnly(
  groupAddresses: string[],
  chainId: ChainId,
  web3: Web3
): Promise<Set<unknown>> {
  const multicall = getMultiCallForChain(
    chainId,
    web3.eth.currentProvider as unknown as HttpProvider
  );
  const specificGroupStrategyContract = makeSpecificGroupStrategyContract(chainId, web3);

  const calls = groupAddresses.map((groupAddress) => {
    return specificGroupStrategyContract.methods.isBlockedGroup(groupAddress);
  });

  const noMulticall = true;
  let results: boolean[] = [];
  if (noMulticall) {
    results = await Promise.all(calls.map((call) => call.call()));
  } else {
    results = await multicall.aggregate(calls);
  }

  return getGoodAddresses(results, groupAddresses);
}

function makeSpecificGroupStrategyContract(chainId: ChainId, web3: Web3) {
  const specificGroupStrategyAddress = getContractAddressForChain(chainId, 'specificGroupStrategy');
  const specificGroupStrategyContract = new web3.eth.Contract(
    SpecificGroupStrategyABI as unknown as AbiItem,
    specificGroupStrategyAddress
  ) as unknown as SpecificGroupStrategy;
  return specificGroupStrategyContract;
}
