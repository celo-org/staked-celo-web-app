// import { newKit } from '@celo/contractkit/lib/mini-kit'
import { Alfajores, ChainId } from '@celo/react-celo';
import { gql, request } from 'graphql-request';
import { EXPLORER_GRAPH_ALFAJORES_URL, EXPLORER_GRAPH_MAINNET_URL } from 'src/config/consts';
// import { areGroupsBlocked } from 'src/features/validators/data/areGroupsBlocked'
// import Web3 from 'web3'

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

export default async function fetchValidGroups(chainId: number): Promise<ValidGroups> {
  const url =
    Alfajores.chainId === chainId ? EXPLORER_GRAPH_ALFAJORES_URL : EXPLORER_GRAPH_MAINNET_URL;
  const data = await request<GraphValues>(url, query);

  const allPossibleGroups = data.celoValidatorGroups;
  // TODO Filter way block groups and groups with bad health per
  // https://github.com/celo-org/staked-celo/blob/master/contracts/Manager.sol#L348

  // const kit = newKit(chainId === ChainId.Alfajores ? Alfajores.rpcUrl : Mainnet.rpcUrl)
  // const blocked = await areGroupsBlocked(allPossibleGroups.map((group) => group.address), chainId, kit.connection.web3 as unknown as Web3)

  return {
    chainId: chainId,
    groups: allPossibleGroups,
  };
}
