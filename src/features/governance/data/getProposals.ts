import { governanceABI } from '@celo/abis';
import { ProposalStage } from 'src/features/governance/components/Details';
import celoRegistry from 'src/utils/celoRegistry';
import clients, { ChainIds } from 'src/utils/clients';
import { getRawGithubUrl, ParsedYAML, parsedYAMLFromMarkdown } from 'src/utils/proposals';
import { Address, getContract } from 'viem';
import { MiniProposal, Proposal } from './Proposal';

const PROPOSAL_STAGE_KEYS = Object.keys(ProposalStage);
type MetadataResult = [Address, bigint, bigint, bigint, string];

export const getProposals = async (chainId: ChainIds) => {
  const publicClient = clients[chainId];
  const registryContract = getContract({ ...celoRegistry, client: publicClient });
  const governanceAddress = await registryContract.read.getAddressForString(['Governance']);
  const governanceContract = getContract({
    address: governanceAddress,
    abi: governanceABI,
    client: publicClient,
  });

  const _dequeue = await governanceContract.read.getDequeue();
  const stageCalls: Array<{
    address: Address;
    abi: typeof governanceABI;
    functionName: 'getProposalStage';
    args: [bigint];
  }> = _dequeue.map((proposalId) => ({
    address: governanceAddress,
    abi: governanceABI,
    functionName: 'getProposalStage',
    args: [proposalId],
  }));

  const stages = (await publicClient.multicall({ contracts: stageCalls })).map(
    (x) => x.result as unknown as number
  );

  const proposals = _dequeue.map(
    (proposalID, i) =>
      ({
        proposalID: proposalID.toString(),
        stage: PROPOSAL_STAGE_KEYS[stages[i]],
      }) as MiniProposal
  );

  const current = proposals.filter((x) => runningProposalStages.has(x.stage));
  // TODO: this is kinda wrong, proposals that passed are not in the dequeue
  // so this filter only gets expired and none voted proposals
  // const passed = proposals
  //   .filter((x) => pastProposalStages.has(x.stage))
  //   .sort((a, b) => (parseInt(a.proposalID, 10) < parseInt(b.proposalID, 10) ? 1 : -1))
  //   .slice(0, 5);
  const passed = [] as MiniProposal[];

  const relevantProposals = [...current, ...passed];
  const metadataCalls: Array<{
    address: Address;
    abi: typeof governanceABI;
    functionName: 'getProposal';
    args: [string];
  }> = relevantProposals.map((proposal) => ({
    address: governanceAddress,
    abi: governanceABI,
    functionName: 'getProposal',
    args: [proposal.proposalID],
  }));

  const metadatas = (await publicClient.multicall({ contracts: metadataCalls })).map(
    (x) => x.result
  );

  metadatas.forEach((metadata, i) => {
    if (!metadata) return; // dont filter becasuse indexes are matched
    relevantProposals[i].metadata = {
      timestamp: metadata[2].toString(),
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
            proposalID: proposal.proposalID.toString(),
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
// const pastProposalStages = new Set([ProposalStage.Expiration, ProposalStage.Execution]);

export const getProposalRecord = async (
  chainId: ChainIds,
  proposalID: string
): Promise<SerializedProposal | null> => {
  const publicClient = clients[chainId];
  const registryContract = getContract({ ...celoRegistry, client: publicClient });
  const governanceAddress = await registryContract.read.getAddressForString(['Governance']);

  const [_dequeue, _stage, _metadata] = (
    await publicClient.multicall({
      contracts: [
        {
          address: governanceAddress,
          abi: governanceABI,
          functionName: 'getDequeue',
        },
        {
          address: governanceAddress,
          abi: governanceABI,
          functionName: 'getProposalStage',
          args: [BigInt(proposalID)],
        },
        {
          address: governanceAddress,
          abi: governanceABI,
          functionName: 'getProposal',
          args: [BigInt(proposalID)],
        },
      ],
    })
  ).map((x) => x.result);

  const dequeue = _dequeue as bigint[];
  const stage = _stage as number;
  const metadata = _metadata as unknown as MetadataResult;

  return {
    proposalID,
    stage: PROPOSAL_STAGE_KEYS[stage as number] as ProposalStage,
    metadata: {
      timestamp: metadata[2].toString(),
      descriptionURL: metadata[4],
    },
    index: (dequeue as bigint[]).findIndex((id) => proposalID === id.toString()),
  } as unknown as SerializedProposal;
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
      cgp: proposal.proposalID.toString(),
      title: `Proposal ${proposal.proposalID}`,
      dateCreated: proposal.metadata.timestamp.toString(),
      author: '',
      status: proposal.stage,
      discussionsTo: '',
      governanceProposalId: proposal.proposalID.toString(),
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
