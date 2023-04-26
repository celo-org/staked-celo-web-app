import { newKit } from '@celo/contractkit';
import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import { useCelo } from '@celo/react-celo';
import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useAccountAddress } from 'src/contexts/account/useAddress';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { showElectionToast } from 'src/features/swap/utils/toast';
import { VoteType } from 'src/types';
import chainIdToRPC from 'src/utils/chainIdToRPC';
import { transactionEvent } from 'src/utils/ga';

export const useVote = () => {
  const { managerContract, voteContract, sendTransaction } = useBlockchain();
  const { suggestedGasPrice } = useProtocolContext();
  const { stCeloBalance, reloadStrategy } = useAccountContext();
  const { walletChainId } = useCelo();
  const { address } = useAccountAddress();

  /*
   * @param groupAddress the address of validator group OR 0 for default
   */
  const [voteProposal, voteProposalStatus] = useAsyncCallback(
    async (proposal: SerializedProposal, vote: VoteType) => {
      if (!address || !managerContract) {
        throw new Error('vote called before loading completed');
      }
      if (proposal.stage !== ProposalStage.Referendum) {
        throw new Error('vote called on proposal that is not in Referendum stage');
      }
      const voteProposalTxObject = managerContract?.methods.voteProposal(
        proposal.proposalID,
        proposal.index,
        // TODO: use `toCelo` to get weight
        vote === VoteType.yes ? `0x${stCeloBalance.toString(16)}` : `0x0`,
        vote === VoteType.no ? `0x${stCeloBalance.toString(16)}` : `0x0`,
        vote === VoteType.abstain ? `0x${stCeloBalance.toString(16)}` : `0x0`
      );
      const txOptions = { from: address, gasPrice: suggestedGasPrice };
      transactionEvent({
        action: 'voteProposal',
        status: 'initiated_transaction',
        value: '',
      });
      await sendTransaction(voteProposalTxObject, txOptions);
      transactionEvent({
        action: 'voteProposal',
        status: 'signed_transaction',
        value: '',
      });
      showElectionToast();
      await reloadStrategy(address);
    },
    [address, suggestedGasPrice, managerContract, reloadStrategy]
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

  /**
   * TODO: out of scope for now
   */
  const [upvote, upvoteStatus] = useAsyncCallback(
    async (proposal: SerializedProposal) => {
      if (!address || !managerContract) {
        throw new Error('vote called before loading completed');
      }
      if (proposal.stage !== ProposalStage.Queued) {
        throw new Error('vote called on proposal that is not in Queued stage');
      }

      const kit = newKit(chainIdToRPC(walletChainId!));
      const governance = await kit.contracts.getGovernance();

      const upvoteTxObject = await governance.upvote(proposal.proposalID, address);
      const txOptions = { from: address, gasPrice: suggestedGasPrice };
      transactionEvent({
        action: 'upvote',
        status: 'initiated_transaction',
        value: '',
      });
      await sendTransaction(upvoteTxObject, txOptions);
      transactionEvent({
        action: 'upvote',
        status: 'signed_transaction',
        value: '',
      });
      showElectionToast();
      await reloadStrategy(address);
    },
    [walletChainId, address, suggestedGasPrice, managerContract, reloadStrategy]
  );

  return { voteProposal, voteProposalStatus, upvote, upvoteStatus, getHasVoted, getHasVotedStatus };
};
