import { newKit } from '@celo/contractkit';
import { GovernanceWrapper, ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
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

  const list = allProposals.filter((p) => p !== null) as Proposal[];

  return {
    proposals: list.filter((x) => runningProposalStages.has(x.stage)),
    pastProposals: list.filter((x) => pastProposalStages.has(x.stage)).slice(0, 5),
  };
};

const runningProposalStages = new Set([ProposalStage.Queued, ProposalStage.Referendum]);
const pastProposalStages = new Set([ProposalStage.Expiration, ProposalStage.Execution]);

export const getProposalRecord = async (
  governance: GovernanceWrapper,
  proposalID: string
): Promise<Proposal | null> => {
  const proposal = await governance.getProposalRecord(proposalID);
  const md = await fetch(getRawGithubUrl(proposal))
    .then((x) => x.text())
    .catch(() => "Failed to fetch proposals' markdown");
  return {
    ...proposal,
    proposalID,
    parsedYAML: parsedYAMLFromMarkdown(md),
    metadata: {
      descriptionURL: proposal.metadata.descriptionURL,
      timestamp: proposal.metadata.timestamp.toString() as any,
    },
  };
};
