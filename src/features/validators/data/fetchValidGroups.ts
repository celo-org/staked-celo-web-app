import { gql, request } from 'graphql-request';
import { EXPLORER_GRAPH_ALFAJORES_URL, EXPLORER_GRAPH_MAINNET_URL } from 'src/config/consts';
import { healthyGroupsOnly } from 'src/features/validators/data/healthyGroupsOnly';
import { nonBlockedGroupsOnly } from 'src/features/validators/data/nonBlockedGroupsOnly';
import { ChainIds } from 'src/utils/clients';
import { celoAlfajores as Alfajores } from 'viem/chains';

export interface ValidatorGroup {
  name: string;
  address: string;
}

const query = gql`
  {
    celoValidatorGroups {
      name
      address
    }
  }
`;

interface GraphValues {
  celoValidatorGroups: ValidatorGroup[];
}

interface ValidGroups {
  chainId: number;
  groups: ValidatorGroup[];
}

// returns ValidatorGroups that are healthy and not blocked based on
// criteria defined i https://github.com/celo-org/staked-celo/blob/master/contracts/Manager.sol#L348
export default async function fetchValidGroups(chainId: ChainIds): Promise<ValidGroups> {
  const url = Alfajores.id === chainId ? EXPLORER_GRAPH_ALFAJORES_URL : EXPLORER_GRAPH_MAINNET_URL;
  const data = await request<GraphValues>(url, query);

  const allPossibleGroups = data.celoValidatorGroups;

  const groupAddresses = allPossibleGroups.map((group) => group.address);
  const [healthyGroups, nonBlockedGroups] = await Promise.all(
    [healthyGroupsOnly, nonBlockedGroupsOnly].map((fn) => fn(groupAddresses, chainId))
  );
  const validGroups = allPossibleGroups.filter(
    (group) => healthyGroups.has(group.address) && nonBlockedGroups.has(group.address)
  );

  return {
    chainId: chainId,
    groups: validGroups,
  };
}
