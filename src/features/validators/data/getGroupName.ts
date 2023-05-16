import Accounts from '@celo/abis/Accounts.json';
import { ADDRESS_ZERO } from 'src/config/consts';
import getCeloRegistry from 'src/utils/celoRegistry';
import clients from 'src/utils/clients';
import { getContract, PublicClient } from 'viem';

async function getAccountsContract(publicClient: PublicClient) {
  const registryContract = getCeloRegistry(publicClient);
  const result = await registryContract.read.getAddressForString(['Accounts']);
  const address = result as `0x${string}`;
  return {
    address,
    abi: Accounts.abi,
    contract: getContract({
      address,
      abi: Accounts.abi,
      publicClient,
    }),
  };
}

export default async function getGroupName(chainId: number, address: string): Promise<string> {
  const publicClient = clients[chainId];
  if (address === ADDRESS_ZERO) {
    return 'Default Strategy';
  }
  const AccountsContract = await getAccountsContract(publicClient);

  const groupName: string = (await AccountsContract.contract.read.getName([address])) as string;
  return groupName;
}
