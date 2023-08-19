import { useCallback } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useProposalVotes } from 'src/contexts/account/useProposalVotes';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useGasPrices } from 'src/contexts/protocol/useGasPrices';
import { ProposalStage } from 'src/features/governance/components/Details';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { showErrorToast, showStakingToast, showVoteToast } from 'src/features/swap/utils/toast';
import logger from 'src/services/logger';
import { VoteType } from 'src/types';
import chainIdToChain from 'src/utils/chainIdToChain';
import { transactionEvent } from 'src/utils/ga';
import { readFromCache, writeToCache } from 'src/utils/localSave';
import { StCelo } from 'src/utils/tokens';
import { Address, useAccount, useChainId, useContractRead, useContractWrite } from 'wagmi';

export const useVote = () => {
  const { managerContract, voteContract, stakedCeloContract } = useBlockchain();
  const { suggestedGasPrice } = useGasPrices();
  const { stCeloBalance } = useAccountContext();
  const { address } = useAccount();
  const chainId = useChainId();
  const network = chainIdToChain(chainId);
  const { getVotesForProposal } = useProposalVotes();
  const getVoteCacheKey = useCallback(
    (id: string, addr: string) => {
      return `${network.name}:${addr}:voteProposal:${id}`;
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
      if (!address || !managerContract || !proposal.index) {
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
      try {
        await _voteProposal?.({
          args: [
            BigInt(proposal.proposalID),
            BigInt(proposal.index),
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
        writeToCache(getVoteCacheKey(proposal.proposalID.toString(), address), [
          vote,
          stCeloBalance.toString(),
        ]);
        showVoteToast({ vote, proposalID: proposal.proposalID.toString() });
      } catch (e: unknown) {
        logger.error('voteProposal error', e);
        showErrorToast(
          (e as Error).message.includes('rejected')
            ? 'User rejected the request'
            : (e as Error).message.includes('Invalid Currency')
            ? 'User provided an Invalid Currency'
            : (e as Error).message.includes('Insufficient funds')
            ? 'Insufficient Funds'
            : (e as Error).message
        );        
      } finally {
        callbacks?.onSent?.();
      }
    },
    [address, suggestedGasPrice, voteWeight, _voteProposal]
  );

  const getProposalVote = useCallback(
    async (proposalId: string, address: string) => {
      const nodeData = await getVotesForProposal(proposalId);
      const localData = readFromCache(getVoteCacheKey(proposalId, address));

      if (!nodeData && !localData?.data) {
        return null;
      }
      return {
        vote: nodeData?.vote || (localData?.data[0] as string),
        weight: nodeData?.weight || (localData?.data[1] as string),
      };
    },
    [getVoteCacheKey, getVotesForProposal]
  );

  const { data: proposalIds } = useContractRead({
    ...voteContract,
    functionName: 'getVotedStillRelevantProposals',
    args: [address!],
    enabled: !!address,
    keepPreviousData: false,
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

  const { data: lockedVoteBalance } = useContractRead({
    ...stakedCeloContract,
    functionName: 'lockedVoteBalanceOf',
    args: [address as Address],
    enabled: !!address,
    select(data) {
      return new StCelo(data);
    },
  });

  const { data: lockedStCeloInVoting } = useContractRead({
    ...voteContract,
    functionName: 'getLockedStCeloInVoting',
    args: [address as Address],
    enabled: !!address,
    select(data) {
      return new StCelo(data);
    },
  });

  const { writeAsync: _unlockVoteBalance } = useContractWrite({
    ...stakedCeloContract,
    functionName: 'unlockVoteBalance',
  });

  const [unlockVoteBalance] = useAsyncCallback(
    async (callbacks?: TxCallbacks) => {
      if (!address || !_unlockVoteBalance) {
        throw new Error('vote called before loading completed');
      }
      try {
        await _unlockVoteBalance?.({
          args: [address as Address],
        });
        showStakingToast(lockedVoteBalance!);
      } catch (e: unknown) {
        logger.error('voteProposal error', e);
        showErrorToast(
          (e as Error).message.includes('rejected')
            ? 'User rejected the request'
            : (e as Error).message
        );
      } finally {
        callbacks?.onSent?.();
      }
    },
    [address]
  );

  return {
    voteProposal,
    voteProposalStatus,
    getHasVoted,
    getHasVotedStatus,
    getProposalVote,
    lockedVoteBalance,
    lockedStCeloInVoting,
    unlockVoteBalance,
  };
};
