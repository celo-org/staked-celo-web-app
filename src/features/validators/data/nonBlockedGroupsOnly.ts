import SpecificGroupStrategyABI from 'src/blockchain/ABIs/SpecificGroupStrategy.json';
import { getContractAddressForChain } from 'src/config/contracts';
import clients from 'src/utils/clients';
import { getContract } from 'viem';
import { getGoodAddresses } from './getGoodAddresses';

// once complete will return all the addresses of groups that are not blocked
export async function nonBlockedGroupsOnly(
  groupAddresses: string[],
  chainId: number
): Promise<Set<string>> {
  const client = clients[chainId];
  const specificGroupStrategyContract = getContract({
    abi: SpecificGroupStrategyABI,
    address: getContractAddressForChain(chainId, 'specificGroupStrategy'),
    publicClient: client,
  });

  const calls = groupAddresses.map((groupAddress) => ({
    address: getContractAddressForChain(chainId, 'specificGroupStrategy'),
    abi: SpecificGroupStrategyABI,
    functionName: 'isBlockedGroup',
    args: [groupAddress],
  }));

  let results: boolean[] = [];
  try {
    results = (await client.multicall({ contracts: calls })).map((x) => x.result as boolean);
  } catch (error) {
    results = await Promise.all(
      calls.map(
        (call) => specificGroupStrategyContract.read.isGroupValid(call.args) as Promise<boolean>
      )
    );
  }

  return getGoodAddresses(results, groupAddresses);
}
