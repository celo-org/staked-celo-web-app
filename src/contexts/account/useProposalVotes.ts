import { useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { VoteType } from 'src/types';

interface Vote {
  vote: VoteType;
  weight: string;
}
type ProposalID = string;

export type VoteRecords = Record<ProposalID, Vote | null>;

// Don't call directly use `votes` from `useAccountContext`
export function useProposalVotes(address: string | null) {
  const { voteContract } = useBlockchain();
  const [votes, setVotes] = useState<VoteRecords>({});
  const [loadVotes] = useAsyncCallback(async () => {
    if (!address || !voteContract) {
      return;
    }

    const fromBlock = 15086029; //TODO set to the block number of Contract deployment

    const events = await voteContract.getPastEvents('ProposalVoted', {
      filter: {
        voter: address,
      },
      fromBlock,
      toBlock: 'latest',
    });

    const voteRecords = events.reduce((sum, currentEvent) => {
      const values = currentEvent.returnValues;
      const vote = Object.keys(values)
        .filter((key) => key === 'yesVotes' || key === 'noVotes' || key === 'abstainVotes')
        .find((key) => values[key] !== '0');

      sum[values.proposalId] = vote
        ? {
            vote: vote.replace('Votes', '') as VoteType,
            weight: values[vote as keyof typeof values] as string,
          }
        : null;

      return sum;
    }, {} as VoteRecords);
    setVotes(voteRecords);
  }, [address, voteContract]);

  useEffect(() => {
    void loadVotes();
  }, [loadVotes]);

  return { votes, loadVotes };
}
