import { accountsABI } from 'src/blockchain/ABIs/Celo';
import { ADDRESS_ZERO } from 'src/config/consts';
import celoRegistry from 'src/utils/celoRegistry';
import clients from 'src/utils/clients';
import { Address, getContract } from 'viem';

export default async function getGroupName(chainId: number, address: Address): Promise<string> {
  const publicClient = clients[chainId];
  if (address === ADDRESS_ZERO) {
    return 'Default Strategy';
  }
  const registryContract = getContract({ ...celoRegistry, publicClient });
  const accountsAddress = await registryContract.read.getAddressForString(['Accounts']);
  const accountsContract = getContract({
    address: accountsAddress,
    abi: accountsABI,
    publicClient,
  });

  const groupName: string = (await accountsContract.read.getName([address])) as string;
  return groupName;
}
