import { newKit } from '@celo/contractkit/lib/mini-kit';
import { Alfajores, ChainId } from '@celo/react-celo';
import { gql, request } from 'graphql-request';
import { EXPLORER_GRAPH_ALFAJORES_URL, EXPLORER_GRAPH_MAINNET_URL } from 'src/config/consts';
import { healthyGroupsOnly } from 'src/features/validators/data/healthyGroupsOnly';
import { nonBlockedGroupsOnly } from 'src/features/validators/data/nonBlockedGroupsOnly';
import chainIdToRPC from 'src/utils/chainIdToRPC';
import Web3 from 'web3';

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
  chainId: ChainId;
  groups: ValidatorGroup[];
}

// returns ValidatorGroups that are healthy and not blocked based on
// criteria defined i https://github.com/celo-org/staked-celo/blob/master/contracts/Manager.sol#L348
export default async function fetchValidGroups(chainId: number): Promise<ValidGroups> {
  const url =
    Alfajores.chainId === chainId ? EXPLORER_GRAPH_ALFAJORES_URL : EXPLORER_GRAPH_MAINNET_URL;
  const data = await request<GraphValues>(url, query);

  const allPossibleGroups = data.celoValidatorGroups;

  const groupAddresses = allPossibleGroups.map((group) => group.address);
  const kit = newKit(chainIdToRPC(chainId as ChainId));

  // TODO remove this once contracts are deployed to mainnet
  // only while no contracts deployed return now so its doesnt crash
  if (chainId === ChainId.Mainnet) {
    return {
      chainId: chainId,
      groups: allPossibleGroups,
    };
  }

  const [healthyGroups, nonBlockedGroups] = await Promise.all(
    [healthyGroupsOnly, nonBlockedGroupsOnly].map((fn) =>
      fn(groupAddresses, chainId, kit.connection.web3 as unknown as Web3)
    )
  );
  const validGroups = allPossibleGroups.filter(
    (group) => healthyGroups.has(group.address) && nonBlockedGroups.has(group.address)
  );

  return {
    chainId: chainId,
    groups: validGroups,
  };
}
