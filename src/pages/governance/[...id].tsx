import { newKit } from '@celo/contractkit';
import { ChainId } from '@celo/react-celo';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Details } from 'src/features/governance/components/Details';
import {
  getProposalRecord,
  getYamlForProposal,
  SerializedProposal,
} from 'src/features/governance/data/getProposals';
import { useRedirectToConnectedChainIfNeeded } from 'src/hooks/useRedirectToConnectedChainIfNeeded';
import chainIdToRPC from 'src/utils/chainIdToRPC';

interface Props {
  proposal: SerializedProposal;
  serverChainId: ChainId;
}

const GovernanceDetailsPage: NextPage<Props> = ({ proposal, serverChainId }) => {
  const router = useRouter();
  const { id } = router.query;
  const proposalId = Array.isArray(id) ? id[0] : id;
  useRedirectToConnectedChainIfNeeded(serverChainId, `/governance/${proposalId}`);

  return <Details proposal={proposal} />;
};

export default GovernanceDetailsPage;

const MAX_AGE_SECONDS = 60 * 5;
const SWR_SECONDS = 60 * 60 * 2;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, params, res }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SWR_SECONDS}`
  );

  const proposalID = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const chainId = Number(query.chainId as string);

  if (typeof proposalID !== 'string') {
    return {
      notFound: true,
    };
  }

  const kit = newKit(chainIdToRPC(chainId));
  const governance = await kit.contracts.getGovernance();

  const proposal = await getProposalRecord(governance, proposalID);

  if (proposal === null) {
    return {
      notFound: true,
    };
  }
  const parsedYAML = await getYamlForProposal(proposal);

  return {
    props: {
      serverChainId: chainId,
      proposal: {
        ...proposal,
        parsedYAML,
      },
    },
  };
};
