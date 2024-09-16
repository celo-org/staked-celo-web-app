import SpecificGroupStrategyABI from 'src/blockchain/ABIs/SpecificGroupStrategy';
import { getContractAddressForChain } from 'src/config/contracts';
import clients, { ChainIds } from 'src/utils/clients';
import { Address, getContract } from 'viem';
import { getGoodAddresses } from './getGoodAddresses';

// once complete will return all the addresses of groups that are not blocked
export async function nonBlockedGroupsOnly(
  groupAddresses: string[],
  chainId: ChainIds
): Promise<Set<string>> {
  const client = clients[chainId];
  const specificGroupStrategyContract = getContract({
    abi: SpecificGroupStrategyABI,
    address: getContractAddressForChain(chainId, 'specificGroupStrategy'),
    client,
  });

  const calls: Array<{
    address: Address;
    abi: typeof SpecificGroupStrategyABI;
    functionName: 'isBlockedGroup';
    args: [Address];
  }> = groupAddresses.map((groupAddress) => ({
    address: getContractAddressForChain(chainId, 'specificGroupStrategy'),
    abi: SpecificGroupStrategyABI,
    functionName: 'isBlockedGroup',
    args: [groupAddress] as [Address],
  }));

  let results: boolean[] = [];
  try {
    results = (await client.multicall({ contracts: calls })).map((x) => !!x.result);
  } catch (error) {
    results = await Promise.all(
      calls.map(
        (call) => specificGroupStrategyContract.read.isBlockedGroup(call.args) as Promise<boolean>
      )
    );
  }

  return getGoodAddresses(results, groupAddresses);
}
