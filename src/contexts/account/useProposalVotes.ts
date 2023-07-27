import { useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import useAddresses from 'src/hooks/useAddresses';
import { Option, VoteType } from 'src/types';
import { Address, usePublicClient } from 'wagmi';

interface Vote {
  vote: VoteType;
  weight: string;
}
type ProposalID = string;

export type VoteRecords = Record<ProposalID, Vote | null>;

// Don't call directly use `votes` from `useAccountContext`
export function useProposalVotes(address: Option<Address>) {
  const [votes, setVotes] = useState<VoteRecords>({});
  const addresses = useAddresses();
  const publicClient = usePublicClient();
  const [loadVotes] = useAsyncCallback(async () => {
    if (!address) {
      return;
    }
    // This times out with deployment block to latest
    // TODO does searching by proposalID help? AND/OR start when proposal went to referendum? and end when it goes to next stage or if in ref to latest?
    const fromBlock = 19918403n; // Block number of deployment of specific group strategy contract https://celoscan.io/tx/0x03a035646ae34e0ae79a7092c7d3521295863608b6061f15d983dc4b331b2bb3
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
