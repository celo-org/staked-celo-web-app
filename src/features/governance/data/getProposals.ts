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

  const _dequeue = (await governanceContract.contract.read.getDequeue([])) as bigint[];
  const stageCalls = _dequeue.map((proposalId) => ({
    address: governanceContract.address,
    abi: governanceContract.abi,
    functionName: 'getProposalStage',
    args: [proposalId],
  }));

  // @ts-expect-error
  const stages = (await publicClient.multicall({ contracts: stageCalls })).map(
    (x) => x.result as unknown as number
  );

  const proposals = _dequeue.map(
    (proposalID, i) =>
      ({
        proposalID: proposalID.toString(),
        stage: PROPOSAL_STAGE_KEYS[stages[i]],
      } as MiniProposal)
  );

  const current = proposals.filter((x) => runningProposalStages.has(x.stage));
  const passed = proposals
    .filter((x) => pastProposalStages.has(x.stage))
    .sort((a, b) => (parseInt(a.proposalID, 10) < parseInt(b.proposalID, 10) ? 1 : -1))
    .slice(0, 5);

  const relevantProposals = [...current, ...passed];
  const metadataCalls = relevantProposals.map((proposal) => ({
    address: governanceContract.address,
    abi: governanceContract.abi,
    functionName: 'getProposal',
    args: [proposal.proposalID],
  }));

  // @ts-expect-error
  const metadatas = (await publicClient.multicall({ contracts: metadataCalls })).map(
    (x) => x.result as MetadataResult
  );

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

  const [_dequeue, _stage, _metadata] = (
    await publicClient.multicall({
      contracts: [
        {
          address: governanceContract.address,
          // @ts-expect-error
          abi: governanceContract.abi,
          functionName: 'getDequeue',
          args: [],
        },
        {
          address: governanceContract.address,
          // @ts-expect-error
          abi: governanceContract.abi,
          functionName: 'getProposalStage',
          args: [proposalID],
        },
        {
          address: governanceContract.address,
          // @ts-expect-error
          abi: governanceContract.abi,
          functionName: 'getProposal',
          args: [proposalID],
        },
      ],
    })
  ).map((x) => x.result as bigint[] | number | MetadataResult);

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
