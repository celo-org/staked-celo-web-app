import { useCallback } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { ProposalStage } from 'src/features/governance/components/Details';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { showVoteToast } from 'src/features/swap/utils/toast';
import { VoteType } from 'src/types';
import chainIdToChain from 'src/utils/chainIdToChain';
import { transactionEvent } from 'src/utils/ga';
import { readFromCache, writeToCache } from 'src/utils/localSave';
import { useAccount, useChainId, useContractRead, useContractWrite } from 'wagmi';

export const useVote = () => {
  const { managerContract, voteContract } = useBlockchain();
  const { suggestedGasPrice } = useGasPrices();
  const { stCeloBalance, votes } = useAccountContext();
  const { address } = useAccount();
  const chainId = useChainId();
  const network = chainIdToChain(chainId);

  const getVoteCacheKey = useCallback(
    (id: string) => {
      return `${network.name}:voteProposal:${id}`;
    },
    [network.name]
  );

  const { data: voteWeight } = useContractRead({
    ...managerContract,
    functionName: 'toCelo',
    args: [stCeloBalance.toBigInt()],
  });
  const { writeAsync: _voteProposal } = useContractWrite({
    ...managerContract,
    functionName: 'voteProposal',
  });

  /*
   * @param proposal - full serialized proposal
   * @param vote - yes | no | abstain
   */
  const [voteProposal, voteProposalStatus] = useAsyncCallback(
    async (proposal: SerializedProposal, vote: VoteType, callbacks?: TxCallbacks) => {
      if (!address || !managerContract) {
        throw new Error('vote called before loading completed');
      }
      if (proposal.stage !== ProposalStage.Referendum) {
        throw new Error('vote called on proposal that is not in Referendum stage');
      }
      if (!voteWeight) {
        throw new Error('Unsufficient balance');
      }
      transactionEvent({
        action: 'voteProposal',
        status: 'initiated_transaction',
        value: vote,
      });
      await _voteProposal?.({
        args: [
          BigInt(proposal.proposalID),
          BigInt(proposal.index!),
          vote === VoteType.yes ? voteWeight : 0n,
          vote === VoteType.no ? voteWeight : 0n,
          vote === VoteType.abstain ? voteWeight : 0n,
        ],
      });
      transactionEvent({
        action: 'voteProposal',
        status: 'signed_transaction',
        value: voteWeight.toString(),
      });
      callbacks?.onSent?.();
      writeToCache(getVoteCacheKey(proposal.proposalID.toString()), [
        vote,
        stCeloBalance.toString(),
      ]);
      showVoteToast({ vote, proposalID: proposal.proposalID.toString() });
    },
    [address, suggestedGasPrice, voteWeight, _voteProposal]
  );

  const getProposalVote = useCallback(
    (proposalId: string) => {
      const nodeData = votes[proposalId];
      const localData = readFromCache(getVoteCacheKey(proposalId));

      if (!nodeData && !localData?.data) {
        return null;
      }

      return {
        vote: nodeData?.vote || localData?.data[0],
        weight: nodeData?.weight || localData?.data[1],
      };
    },
    [votes, getVoteCacheKey]
  );

  const { data: proposalIds } = useContractRead({
    ...voteContract,
    functionName: 'getVotedStillRelevantProposals',
    args: [address!],
    enabled: !!address,
  });

  const [getHasVoted, getHasVotedStatus] = useAsyncCallback(
    async (proposal: SerializedProposal): Promise<boolean> => {
      if (!proposalIds) {
        throw new Error('vote called before loading completed');
      }
      return proposalIds.includes(BigInt(proposal.proposalID));
    },
    [proposalIds]
  );

  return { voteProposal, voteProposalStatus, getHasVoted, getHasVotedStatus, getProposalVote };
};
