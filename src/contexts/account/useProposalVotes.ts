import { governanceABI } from '@celo/abis/types/wagmi/index';
import { useCallback } from 'react';
import useAddresses from 'src/hooks/useAddresses';
import { VoteType } from 'src/types';
import celoRegistry from 'src/utils/celoRegistry';
import { useAccount, usePublicClient } from 'wagmi';

interface Vote {
  vote: VoteType;
  weight: string;
}
type ProposalID = string;

// Don't call directly use `votes` from `useAccountContext`
export function useProposalVotes() {
  const { address } = useAccount();
  const addresses = useAddresses();
  const publicClient = usePublicClient();
  const getVotesForProposal = useCallback(
    async (proposalId: ProposalID) => {
      if (!address) {
        return;
      }

      const governanceAddress = await publicClient.readContract({
        ...celoRegistry,
        functionName: 'getAddressForString',
        args: ['Governance'],
      });

      const [{ result: proposal }, { result: queueExpiry }, { result: referendumStageDurations }] =
        await publicClient.multicall({
          contracts: [
            {
              address: governanceAddress,
              abi: governanceABI,
              functionName: 'getProposal',
              args: [BigInt(proposalId)],
            },
            {
              address: governanceAddress,
              abi: governanceABI,
              functionName: 'queueExpiry',
            },
            {
              address: governanceAddress,
              abi: governanceABI,
              functionName: 'getReferendumStageDuration',
            },
          ],
        });
      if (!proposal || !queueExpiry || !referendumStageDurations)
        throw new Error('proposal not found with id ' + proposalId);

      const latestBlock = await publicClient.getBlock();

      const blockPadding = 12n; // probably more than necessary, this is 1 minute
      const now = Date.now() / 1000; // work with seconds, not ms

      // infer the fromBlock from the creation timestamp and do some approximative maths
      // with block duration being ~5 seconds
      const createdAtTimestamp = proposal[2];
      const blockDiff = BigInt(Math.floor((now - Number(createdAtTimestamp)) / 5)); // floor to get lowest possible block
      const fromBlock = latestBlock.number! - blockDiff - blockPadding;

      // infer the value of toBlock from the time a proposals stays in flight
      const endedAtTimestampDiff = queueExpiry + referendumStageDurations;
      const endedAtBlockDiff = Math.ceil(Number(endedAtTimestampDiff) / 5); // ceil to get highest possible block
      const endedAtBlock = Number(fromBlock) + endedAtBlockDiff;
      const toBlock = BigInt(Math.min(Number(latestBlock.number!), endedAtBlock));
      const events = await publicClient.getLogs({
        address: addresses.vote,
        event: {
          type: 'event',
          name: 'ProposalVoted',
          inputs: [
            { type: 'address', name: 'voter', indexed: true },
            { type: 'uint256', name: 'proposalId', indexed: true },
            { type: 'uint256', name: 'yesVotes' },
            { type: 'uint256', name: 'noVotes' },
            { type: 'uint256', name: 'abstainVotes' },
          ],
        },
        args: {
          voter: address,
          proposalId: BigInt(proposalId),
        },
        fromBlock,
        toBlock,
      });

      const voteRecord = events.reduce((sum: Vote, currentEvent) => {
        const values = currentEvent.args;
        if (!values) return sum;

        const vote = (['yesVotes', 'noVotes', 'abstainVotes'] as const).find(
          (key) => values[key] !== 0n
        );

        if (vote && values.proposalId) {
          sum.vote = vote.replace('Votes', '') as VoteType;
          sum.weight = values[vote as keyof typeof values] as string;
        }

        return sum;
      }, {} as Vote);
      console.log(voteRecord);

      if (!voteRecord.vote || !voteRecord.weight) return;

      return voteRecord;
    },
    [address, addresses, publicClient]
  );

  return { getVotesForProposal };
}
