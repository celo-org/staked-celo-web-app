import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
import type { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { Details } from 'src/features/governance/components/Details';
import {
  getProposalRecord,
  getYamlForProposal,
  SerializedProposal,
} from 'src/features/governance/data/getProposals';
import { useRedirectToConnectedChainIfNeeded } from 'src/hooks/useRedirectToConnectedChainIfNeeded';

interface Props {
  proposal: SerializedProposal;
  serverChainId: number;
}

const GovernanceDetailsPage: NextPage<Props> = ({ proposal, serverChainId }) => {
  const { slug: id } = Router.query;
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

  const id = params?.slug;
  const proposalID = Array.isArray(id) ? id[0] : id;
  const chainId =
    Number(query.chainId as string) || Celo.id

  if (typeof proposalID !== 'string') {
    return {
      notFound: true,
    };
  }

  const proposal = await getProposalRecord(chainId, proposalID);

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
