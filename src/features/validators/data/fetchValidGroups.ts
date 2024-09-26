import { accountsABI, validatorsABI } from '@celo/abis';
import { healthyGroupsOnly } from 'src/features/validators/data/healthyGroupsOnly';
import { nonBlockedGroupsOnly } from 'src/features/validators/data/nonBlockedGroupsOnly';
import celoRegistry from 'src/utils/celoRegistry';
import { ChainIds } from 'src/utils/clients';
import { createPublicClient, http } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';

export interface ValidatorGroup {
  name: string;
  address: string;
}

interface ValidGroups {
  chainId: number;
  groups: ValidatorGroup[];
}

// returns ValidatorGroups that are healthy and not blocked based on
// criteria defined i https://github.com/celo-org/staked-celo/blob/master/contracts/Manager.sol#L348
export default async function fetchValidGroups(chainId: ChainIds): Promise<ValidGroups> {
  const client = createPublicClient({
    chain: chainId === celo.id ? celo : celoAlfajores,
    transport: http(),
  });
  client;

  const validatorsAddress = await client.readContract({
    ...celoRegistry,
    functionName: 'getAddressForString',
    args: ['Validators'],
  });

  const accountsAddress = await client.readContract({
    ...celoRegistry,
    functionName: 'getAddressForString',
    args: ['Accounts'],
  });

  const allPossibleGroups = await client.readContract({
    abi: validatorsABI,
    address: validatorsAddress,
    functionName: 'getRegisteredValidatorGroups',
  });

  const groupAddresses = allPossibleGroups.map((group) => group);
  const [healthyGroups, nonBlockedGroups] = await Promise.all(
    [healthyGroupsOnly, nonBlockedGroupsOnly].map((fn) => fn(groupAddresses, chainId))
  );
  const validGroups = allPossibleGroups.filter(
    (address) => healthyGroups.has(address) && nonBlockedGroups.has(address)
  );

  const names = await Promise.all(
    validGroups.map((address) => {
      return client.readContract({
        abi: accountsABI,
        address: accountsAddress,
        functionName: 'getName',
        args: [address],
      });
    })
  );

  return {
    chainId: chainId,
    groups: validGroups.map((address, index) => ({ address, name: names[index] })),
  };
}
