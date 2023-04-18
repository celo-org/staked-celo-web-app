import { newKit } from '@celo/contractkit';
import {
  GovernanceWrapper,
  ProposalRecord,
  ProposalStage,
  VoteValue,
} from '@celo/contractkit/lib/wrappers/Governance';
import { ChainId } from '@celo/react-celo';
import chainIdToRPC from 'src/utils/chainIdToRPC';
import { getRawGithubUrl, parsedYAMLFromMarkdown } from 'src/utils/proposals';
import { Proposal } from './Proposal';

export const getProposals = async (chainId: ChainId) => {
  const kit = newKit(chainIdToRPC(chainId));

  const governance = await kit.contracts.getGovernance();

  const _dequeue = await governance.getDequeue();

  const allProposals = await Promise.all(
    _dequeue.map(async (bn) => {
      const proposalID = bn.toString();
      if (proposalID === '0') return null;
      return getProposalRecord(governance, proposalID);
    })
  );

  const proposals = allProposals.filter((p) => p !== null) as Proposal[];

  const current = proposals.filter((x) => runningProposalStages.has(x.stage));
  const passed = proposals
    .filter((x) => pastProposalStages.has(x.stage))
    .sort((a, b) => (Number(a.proposalID) < Number(b.proposalID) ? 1 : -1))
    .slice(0, 5);

  const [currentWithYaml, passedWithYaml] = await Promise.all(
    [current, passed].map(async (list) => {
      return await Promise.all(
        list.map(async (proposal) => {
          const parsedYAML = await getYamlForProposal(proposal.metadata.descriptionURL);
          return {
            ...proposal,
            parsedYAML,
          };
        })
      );
    })
  );

  return {
    proposals: currentWithYaml,
    pastProposals: passedWithYaml,
  };
};

const runningProposalStages = new Set([ProposalStage.Queued, ProposalStage.Referendum]);
const pastProposalStages = new Set([ProposalStage.Expiration, ProposalStage.Execution]);

export const getProposalRecord = async (
  governance: GovernanceWrapper,
  proposalID: string
): Promise<SerializedProposal | null> => {
  const proposal = await governance.getProposalRecord(proposalID);
  return {
    ...jsonSafe(proposal),
    proposalID,
    metadata: {
      descriptionURL: proposal.metadata.descriptionURL,
      timestamp: proposal.metadata.timestamp.toString(),
    },
  };
};

async function getYamlForProposal(descriptionURL: string) {
  const md = await fetch(getRawGithubUrl(descriptionURL))
    .then((x) => x.text())
    .catch(() => "Failed to fetch proposals' markdown");

  return parsedYAMLFromMarkdown(md);
}

export type SerializedProposal = {
  proposalID: Proposal['proposalID'];
  parsedYAML: Proposal['parsedYAML'];
  passed: Proposal['passed'];
  stage: Proposal['stage'];
  metadata: Proposal['metadata'];
  upvotes?: string;
  votes?: {
    [VoteValue.Abstain]: string;
    [VoteValue.No]: string;
    [VoteValue.Yes]: string;
  };
};

function jsonSafe(proposal: ProposalRecord): SerializedProposal {
  const safeProposal = {
    passed: proposal.passed,
    stage: proposal.stage,
  } as SerializedProposal;

  if (proposal.upvotes) {
    safeProposal.upvotes = proposal.upvotes.toJSON();
  }

  if (proposal.votes) {
    safeProposal.votes = {
      [VoteValue.Abstain]: proposal.votes[VoteValue.Abstain].toJSON(),
      [VoteValue.No]: proposal.votes[VoteValue.No].toJSON(),
      [VoteValue.Yes]: proposal.votes[VoteValue.Yes].toJSON(),
    };
  }

  return safeProposal;
}
