import Governance from '@celo/abis/Governance.json';
import { ProposalStage } from 'src/features/governance/components/Details';
import getCeloRegistry from 'src/utils/celoRegistry';
import clients from 'src/utils/clients';
import { getRawGithubUrl, ParsedYAML, parsedYAMLFromMarkdown } from 'src/utils/proposals';
import { getContract, PublicClient } from 'viem';
import { MiniProposal, Proposal } from './Proposal';

const PROPOSAL_STAGE_KEYS = Object.keys(ProposalStage);

type MetadataResult = [string, bigint, bigint, bigint, string];

async function getGovernanceContract(publicClient: PublicClient) {
  const registryContract = getCeloRegistry(publicClient);
  const result = await registryContract.read.getAddressForString(['Governance']);
  const address = result as `0x${string}`;
  return {
    address,
    abi: Governance.abi,
    contract: getContract({
      address,
      abi: Governance.abi,
      publicClient,
    }),
  };
}

export const getProposals = async (chainId: number) => {
  const publicClient = clients[chainId];
  const governanceContract = await getGovernanceContract(publicClient);

  // @ts-expect-error
  const _dequeue: bigint[] = await governanceContract.contract.read.getDequeue([]);
  const stageCalls = _dequeue.map((proposalId) => ({
    address: governanceContract.address,
    abi: governanceContract.abi,
    functionName: 'getProposalStage',
    args: [proposalId],
  }));

  // @ts-expect-error
  const stages: number[] = (await publicClient.multicall({ contracts: stageCalls })).map(
    (x) => x.result
  );

  const proposals = _dequeue.map(
    (proposalID, i) =>
      ({
        proposalID,
        stage: PROPOSAL_STAGE_KEYS[stages[i]],
      } as MiniProposal)
  );

  const current = proposals.filter((x) => runningProposalStages.has(x.stage));
  const passed = proposals
    .filter((x) => pastProposalStages.has(x.stage))
    .sort((a, b) => (a.proposalID < b.proposalID ? 1 : -1))
    .slice(0, 5);

  const relevantProposals = [...current, ...passed];
  const metadataCalls = relevantProposals.map((proposal) => ({
    address: governanceContract.address,
    abi: governanceContract.abi,
    functionName: 'getProposal',
    args: [proposal.proposalID],
  }));

  // @ts-expect-error
  const metadatas: MetadataResult[] = (
    await publicClient.multicall({ contracts: metadataCalls })
  ).map((x) => x.result);

  metadatas.forEach((metadata, i) => {
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
const pastProposalStages = new Set([ProposalStage.Expiration, ProposalStage.Execution]);

export const getProposalRecord = async (
  chainId: number,
  proposalID: string
): Promise<SerializedProposal | null> => {
  const publicClient = clients[chainId];
  const governanceContract = await getGovernanceContract(publicClient);

  //  @ts-expect-error
  const [dequeue, stage, metadata]: [bigint[], number, MetadataResult[]] = (
    await publicClient.multicall({
      contracts: [
        {
          address: governanceContract.address,
          abi: governanceContract.abi,
          functionName: 'getDequeue',
          args: [],
        },
        {
          address: governanceContract.address,
          abi: governanceContract.abi,
          functionName: 'getProposalStage',
          args: [proposalID],
        },
        {
          address: governanceContract.address,
          abi: governanceContract.abi,
          functionName: 'getProposal',
          args: [proposalID],
        },
      ],
    })
  ).map((x) => x.result);

  return {
    proposalID: BigInt(proposalID),
    stage: PROPOSAL_STAGE_KEYS[stage] as ProposalStage,
    metadata: { timestamp: metadata[2].toString(), descriptionURL: metadata[4] },
    index: dequeue.findIndex((id) => proposalID === id.toString()),
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
