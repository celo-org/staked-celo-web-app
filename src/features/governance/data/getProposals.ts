import { ContractKit, newKit } from '@celo/contractkit';
import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import { ChainId } from '@celo/react-celo';
import { getMultiCallForChain } from 'src/config/multicall';
import chainIdToRPC from 'src/utils/chainIdToRPC';
import { ParsedYAML, getRawGithubUrl, parsedYAMLFromMarkdown } from 'src/utils/proposals';
import { HttpProvider } from 'web3-core';
import { MiniProposal, Proposal } from './Proposal';

const PROPOSAL_STAGE_KEYS = Object.keys(ProposalStage);

export const getProposals = async (chainId: ChainId) => {
  const kit = newKit(chainIdToRPC(chainId));
  const multicall = getMultiCallForChain(
    chainId,
    kit.web3.eth.currentProvider as unknown as HttpProvider
  );
  const governance = await kit.contracts._web3Contracts.getGovernance();
  const _dequeue = await governance.methods.getDequeue().call();
  const stageTxs = _dequeue.map((proposalId) => governance.methods.getProposalStage(proposalId));
  const stages: string[] = await multicall.aggregate(stageTxs);

  const proposals = _dequeue.map(
    (proposalID, i) =>
      ({
        proposalID,
        stage: PROPOSAL_STAGE_KEYS[parseInt(stages[i])],
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
  kit: ContractKit,
  chainId: number,
  proposalID: string
): Promise<SerializedProposal | null> => {
  const multicall = getMultiCallForChain(
    chainId,
    kit.web3.eth.currentProvider as unknown as HttpProvider
  );
  const governance = await kit.contracts._web3Contracts.getGovernance();

  const dequeueTx = governance.methods.getDequeue();
  const stageTx = governance.methods.getProposalStage(proposalID);
  const metadataTx = governance.methods.getProposal(proposalID);

  const [dequeue, stage, metadata]: [string[], string, string[]] = await multicall.aggregate([
    dequeueTx,
    stageTx,
    metadataTx,
  ]);

  return {
    proposalID,
    stage: PROPOSAL_STAGE_KEYS[parseInt(stage)] as ProposalStage,
    metadata: { timestamp: metadata[2], descriptionURL: metadata[4] },
    index: dequeue.findIndex((id) => proposalID === id),
  } as SerializedProposal;
};

export async function getYamlForProposal(proposal: MiniProposal) {
  try {
    const md = await fetch(getRawGithubUrl(proposal.metadata.descriptionURL)).then((x) => x.text());
    const parsed = parsedYAMLFromMarkdown(md);
    if (!parsed) {
      throw new Error("Couldn't parse markdown");
    }
    return parsed;
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
  stage: Proposal['stage'];
  metadata: Proposal['metadata'];
  index?: number;
};
