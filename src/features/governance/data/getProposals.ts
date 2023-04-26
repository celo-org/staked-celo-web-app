import { newKit } from '@celo/contractkit';
import {
  GovernanceWrapper,
  ProposalRecord,
  ProposalStage,
} from '@celo/contractkit/lib/wrappers/Governance';
import { ChainId } from '@celo/react-celo';
import { getMultiCallForChain } from 'src/config/multicall';
import chainIdToRPC from 'src/utils/chainIdToRPC';
import { getRawGithubUrl, ParsedYAML, parsedYAMLFromMarkdown } from 'src/utils/proposals';
import { HttpProvider } from 'web3-core';
import { MiniProposal, Proposal } from './Proposal';

export const getProposals = async (chainId: ChainId) => {
  const kit = newKit(chainIdToRPC(chainId));
  const multicall = getMultiCallForChain(
    chainId,
    kit.web3.eth.currentProvider as unknown as HttpProvider
  );
  const governance = await kit.contracts._web3Contracts.getGovernance();
  const _dequeue = await governance.methods.getDequeue().call();
  const stageTxs = _dequeue.map((proposalId) => governance.methods.getProposalStage(proposalId));
  const stages = await multicall.aggregate(stageTxs);

  const proposalStageKeys = Object.keys(ProposalStage);
  const proposals = _dequeue.map(
    (proposalID, i) =>
      ({
        proposalID,
        stage: proposalStageKeys[stages[i]],
      } as MiniProposal)
  );

  const current = proposals.filter((x) => runningProposalStages.has(x.stage));
  const passed = proposals
    .filter((x) => pastProposalStages.has(x.stage))
    .sort((a, b) => (Number(a.proposalID) < Number(b.proposalID) ? 1 : -1))
    .slice(0, 5);

  const relevantProposals = [...current, ...passed];
  const metadataTxs = relevantProposals.map((proposal) =>
    governance.methods.getProposal(proposal.proposalID)
  );
  const metadatas: string[] = await multicall.aggregate(metadataTxs);

  metadatas.forEach((metadata, i) => {
    relevantProposals[i].metadata = {
      timestamp: metadata[2],
      descriptionURL: metadata[4],
    };
  });

  const [currentWithYaml, passedWithYaml] = await Promise.all(
    [current, passed].map(async (list) => {
      return await Promise.all(
        list.map(async (proposal) => {
          const parsedYAML = await getYamlForProposal(proposal);
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
  // TODO
  const proposal = await governance.getProposalRecord(proposalID);
  console.log('stage aaron', JSON.stringify(proposal));
  return {
    ...jsonSafe(proposal),
    proposalID,
    metadata: {
      descriptionURL: proposal.metadata.descriptionURL,
      timestamp: proposal.metadata.timestamp.toString(),
    },
  };
};

export async function getYamlForProposal(proposal: MiniProposal) {
  try {
    const md = await fetch(getRawGithubUrl(proposal.metadata.descriptionURL)).then((x) => x.text());
    return parsedYAMLFromMarkdown(md);
  } catch {
    console.warn(`Failed to fetch proposal markdown at url ${proposal.metadata.descriptionURL}`);

    return {
      cgp: proposal.proposalID,
      title: `Proposal ${proposal.proposalID}`,
      dateCreated: proposal.metadata.timestamp,
      author: '',
      status: proposal.stage,
      discussionsTo: '',
      governanceProposalId: proposal.proposalID,
      dateExecuted: '',
    } as ParsedYAML;
  }
}

export type SerializedProposal = {
  proposalID: Proposal['proposalID'];
  parsedYAML: Proposal['parsedYAML'];
  passed: Proposal['passed'];
  stage: Proposal['stage'];
  metadata: Proposal['metadata'];
};

function jsonSafe(proposal: ProposalRecord): SerializedProposal {
  const safeProposal = {
    passed: proposal.passed,
    stage: proposal.stage,
  } as SerializedProposal;

  // if (proposal.votes) {
  //   safeProposal.votes = {
  //     [VoteValue.Abstain]: proposal.votes[VoteValue.Abstain].toJSON(),
  //     [VoteValue.No]: proposal.votes[VoteValue.No].toJSON(),
  //     [VoteValue.Yes]: proposal.votes[VoteValue.Yes].toJSON(),
  //   };
  // }

  return safeProposal;
}
