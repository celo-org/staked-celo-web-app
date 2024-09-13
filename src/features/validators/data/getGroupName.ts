import { accountsABI } from '@celo/abis';
import { ADDRESS_ZERO } from 'src/config/consts';
import celoRegistry from 'src/utils/celoRegistry';
import clients, { ChainIds } from 'src/utils/clients';
import { Address, getContract } from 'viem';

export default async function getGroupName(chainId: ChainIds, address: Address): Promise<string> {
  const publicClient = clients[chainId];
  if (address === ADDRESS_ZERO) {
    return 'Default Strategy';
  }
  const registryContract = getContract({ ...celoRegistry, client: publicClient });
  const accountsAddress = await registryContract.read.getAddressForString(['Accounts']);
  const accountsContract = getContract({
    address: accountsAddress,
    abi: accountsABI,
    client: publicClient,
  });

  const groupName: string = (await accountsContract.read.getName([address])) as string;
  return groupName;
}
