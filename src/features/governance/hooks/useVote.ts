import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useAccountAddress } from 'src/contexts/account/useAddress';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { showVoteToast } from 'src/features/swap/utils/toast';
import { VoteType } from 'src/types';
import { transactionEvent } from 'src/utils/ga';
import { Celo } from 'src/utils/tokens';

export const useVote = () => {
  const { managerContract, voteContract, sendTransaction } = useBlockchain();
  const { suggestedGasPrice } = useProtocolContext();
  const { stCeloBalance } = useAccountContext();
  const { address } = useAccountAddress();

  /*
   * @param groupAddress the address of validator group OR 0 for default
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
        await managerContract?.methods.toCelo(`0x${stCeloBalance.toFixed(0).toString()}`).call()
      );
      const voteWeight = `0x${asCelo.toString(16)}`;

      const zero = `0x0`;
      const voteProposalTxObject = managerContract?.methods.voteProposal(
        proposal.proposalID,
        proposal.index!,
        vote === VoteType.yes ? voteWeight : zero,
        vote === VoteType.no ? voteWeight : zero,
        vote === VoteType.abstain ? voteWeight : zero
      );
      const txOptions = { from: address, gasPrice: suggestedGasPrice };
      transactionEvent({
        action: 'voteProposal',
        status: 'initiated_transaction',
        value: vote,
      });
      await sendTransaction(voteProposalTxObject, txOptions);
      transactionEvent({
        action: 'voteProposal',
        status: 'signed_transaction',
        value: voteWeight,
      });
      showVoteToast({ vote, proposalID: proposal.proposalID });
    },
    [address, voteContract, suggestedGasPrice, managerContract]
  );

  const [getHasVoted, getHasVotedStatus] = useAsyncCallback(
    async (proposal: SerializedProposal): Promise<boolean> => {
      if (!address || !voteContract) {
        throw new Error('vote called before loading completed');
      }
      const proposalIds = await voteContract?.methods
        .getVotedStillRelevantProposals(address)
        .call();
      return proposalIds.includes(proposal.proposalID);
    },
    [address]
  );

  return { voteProposal, voteProposalStatus, getHasVoted, getHasVotedStatus };
};
