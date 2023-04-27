import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useAccountAddress } from 'src/contexts/account/useAddress';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { showVoteToast } from 'src/features/swap/utils/toast';
import { VoteType } from 'src/types';
import { transactionEvent } from 'src/utils/ga';

export const useVote = () => {
  const { managerContract, voteContract, stCeloContract, sendTransaction } = useBlockchain();
  const { suggestedGasPrice } = useProtocolContext();
  const { stCeloBalance, celoBalance } = useAccountContext();
  const { address } = useAccountAddress();

  const getVoteWeight = useCallback(async () => {
    // Note: copied from https://github.com/celo-org/staked-celo/blob/master/contracts/Vote.sol#L450
    const stCeloSupply = await stCeloContract?.methods
      .totalSupply()
      .call()
      .then((x) => new BigNumber(x));

    if (stCeloSupply?.isZero() || celoBalance.isZero()) {
      return stCeloBalance;
    }

    return stCeloBalance.multipliedBy(celoBalance).dividedBy(stCeloSupply!).toFixed(0);
  }, [stCeloBalance, celoBalance, stCeloContract]);

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
      // TODO: make _voteWeight work?
      const _voteWeight = `0x${(await getVoteWeight()).toString(16)}`;
      const voteWeight = `0x${stCeloBalance.toString(16)}`;
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
    [address, voteContract, suggestedGasPrice, managerContract, getVoteWeight]
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
