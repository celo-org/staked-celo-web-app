import { useCallback } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { ProposalStage } from 'src/features/governance/components/Details';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { showVoteToast } from 'src/features/swap/utils/toast';
import { VoteType } from 'src/types';
import chainIdToChain from 'src/utils/chainIdToChain';
import { transactionEvent } from 'src/utils/ga';
import { readFromCache, writeToCache } from 'src/utils/localSave';
import { Celo } from 'src/utils/tokens';
import { useAccount, useChainId } from 'wagmi';

export const useVote = () => {
  const { managerContract, voteContract, sendTransaction } = useBlockchain();
  const { suggestedGasPrice } = useProtocolContext();
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

  /*
   * @param proposal - full serialized proposal
   * @param vote - yes | no | abstain
   */
  const [voteProposal, voteProposalStatus] = useAsyncCallback(
    async (proposal: SerializedProposal, vote: VoteType) => {
      if (!address || !managerContract || !voteContract) {
        throw new Error('vote called before loading completed');
      }
      if (proposal.stage !== ProposalStage.Referendum) {
        throw new Error('vote called on proposal that is not in Referendum stage');
      }
      const asCelo = new Celo(
        await managerContract?.contract.read.toCelo([`0x${stCeloBalance.toFixed(0).toString()}`])
      );
      const voteWeight = `0x${asCelo.toString(16)}`;

      const zero = `0x0`;
      const { request } = await managerContract.contract.simulate.voteProposal({
        account: address,
        args: [
          proposal.proposalID,
          proposal.index!,
          vote === VoteType.yes ? voteWeight : zero,
          vote === VoteType.no ? voteWeight : zero,
          vote === VoteType.abstain ? voteWeight : zero,
        ],
      });
      transactionEvent({
        action: 'voteProposal',
        status: 'initiated_transaction',
        value: vote,
      });
      await sendTransaction(request);
      transactionEvent({
        action: 'voteProposal',
        status: 'signed_transaction',
        value: voteWeight,
      });
      writeToCache(
        getVoteCacheKey(
          proposal.proposalID.toString(src / features / governance / data / getProposals.ts)
        ),
        [vote, voteWeight]
      );
      showVoteToast({ vote, proposalID: proposal.proposalID.toString() });
    },
    [address, voteContract, suggestedGasPrice, managerContract]
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

  const [getHasVoted, getHasVotedStatus] = useAsyncCallback(
    async (proposal: SerializedProposal): Promise<boolean> => {
      if (!address || !voteContract) {
        throw new Error('vote called before loading completed');
      }
      const proposalIds = (await voteContract?.contract.read.getVotedStillRelevantProposals([
        address,
      ])) as bigint[];
      return proposalIds.includes(proposal.proposalID);
    },
    [address]
  );

  return { voteProposal, voteProposalStatus, getHasVoted, getHasVotedStatus, getProposalVote };
};
