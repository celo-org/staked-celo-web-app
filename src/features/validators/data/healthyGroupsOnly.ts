import { ChainId } from '@celo/react-celo';
import GroupHealthABI from 'src/blockchain/ABIs/GroupHealth.json';
import { GroupHealth } from 'src/blockchain/types';
import { getContractAddressForChain } from 'src/config/contracts';
import { getMultiCallForChain } from 'src/config/multicall';
import Web3 from 'web3';
import { HttpProvider } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { getGoodAddresses } from './getGoodAddresses';

// once complete will return all the addresses of groups that are healthy
export async function healthyGroupsOnly(
  groupAddresses: string[],
  chainId: ChainId,
  web3: Web3
): Promise<Set<string>> {
  const GroupHealthContract = makeGroupHealthContract(chainId, web3);

  const calls = groupAddresses.map((groupAddress) => {
    return GroupHealthContract.methods.isGroupValid(groupAddress);
  });

  const multicall = getMultiCallForChain(
    chainId,
    web3.eth.currentProvider as unknown as HttpProvider
  );

  let results: boolean[] = [];
  try {
    results = await multicall.aggregate(calls);
  } catch (error) {
    results = await Promise.all(calls.map((call) => call.call()));
  }

  return getGoodAddresses(results, groupAddresses, true);
}

function makeGroupHealthContract(chainId: ChainId, web3: Web3) {
  const groupHealthAddress = getContractAddressForChain(chainId, 'groupHealth');
  const GroupHealthContract = new web3.eth.Contract(
    GroupHealthABI as unknown as AbiItem,
    groupHealthAddress
  ) as unknown as GroupHealth;
  return GroupHealthContract;
}
