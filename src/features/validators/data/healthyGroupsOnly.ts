import GroupHealthABI from 'src/blockchain/ABIs/GroupHealth';
import { getContractAddressForChain } from 'src/config/contracts';
import clients from 'src/utils/clients';
import { Address, getContract } from 'viem';
import { getGoodAddresses } from './getGoodAddresses';

// once complete will return all the addresses of groups that are healthy
export async function healthyGroupsOnly(
  groupAddresses: string[],
  chainId: number
): Promise<Set<string>> {
  const client = clients[chainId];
  const GroupHealthContract = getContract({
    abi: GroupHealthABI,
    address: getContractAddressForChain(chainId, 'groupHealth'),
    publicClient: client,
  });

  const calls = groupAddresses.map((groupAddress) => ({
    address: getContractAddressForChain(chainId, 'groupHealth'),
    abi: GroupHealthABI,
    functionName: 'isGroupValid',
    args: [groupAddress] as [Address],
  }));

  let results: boolean[] = [];
  try {
    results = (await client.multicall({ contracts: calls })).map((x) => x.result as boolean);
  } catch (error) {
    results = await Promise.all(
      calls.map((call) => GroupHealthContract.read.isGroupValid(call.args) as Promise<boolean>)
    );
  }

  return getGoodAddresses(results, groupAddresses, true);
}
