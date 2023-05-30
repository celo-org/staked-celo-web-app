import { useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import useAddresses from 'src/hooks/useAddresses';
import { VoteType } from 'src/types';
import { usePublicClient } from 'wagmi';

interface Vote {
  vote: VoteType;
  weight: string;
}
type ProposalID = string;

export type VoteRecords = Record<ProposalID, Vote | null>;

// Don't call directly use `votes` from `useAccountContext`
export function useProposalVotes(address: `0x${string}` | undefined) {
  const [votes, setVotes] = useState<VoteRecords>({});
  const addresses = useAddresses();
  const publicClient = usePublicClient();
  const [loadVotes] = useAsyncCallback(async () => {
    if (!address) {
      return;
    }

    const fromBlock = 15086029n; //TODO set to the block number of Contract deployment
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
      },
      fromBlock,
      toBlock: 'latest',
    });

    const voteRecords = events.reduce((sum: VoteRecords, currentEvent) => {
      const values = currentEvent.args;
      if (!values) return sum;

      const vote = (['yesVotes', 'noVotes', 'abstainVotes'] as const).find(
        (key) => values[key] !== 0n
      );

      if (vote && values.proposalId) {
        sum[values.proposalId.toString()] = {
          vote: vote.replace('Votes', '') as VoteType,
          weight: values[vote as keyof typeof values] as string,
        };
      }

      return sum;
    }, {} as VoteRecords);
    setVotes(voteRecords);
  }, [address, addresses]);

  useEffect(() => {
    void loadVotes();
  }, [loadVotes]);

  return { votes, loadVotes };
}
