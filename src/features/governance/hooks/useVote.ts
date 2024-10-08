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
import { ChainIds } from 'src/utils/clients';
import { transactionEvent } from 'src/utils/ga';
import { deleteFromCache, readFromCache, writeToCache } from 'src/utils/localSave';
import { StCelo } from 'src/utils/tokens';
import type { Address } from 'viem';
import { useAccount, useChainId, usePublicClient, useReadContract, useWriteContract } from 'wagmi';

export const useVote = () => {
  const { managerContract, voteContract, stakedCeloContract } = useBlockchain();
  const { suggestedGasPrice } = useGasPrices();
  const { stCeloBalance } = useAccountContext();
  const { address } = useAccount();
  const chainId = useChainId() as ChainIds;
  const network = chainIdToChain(chainId);
  const publicClient = usePublicClient();
  const { getVotesForProposal } = useProposalVotes();
  const getVoteCacheKey = useCallback(
    (id: string, addr: string) => {
      return `${network.name}:${addr}:voteProposal:${id}`;
    },
    [network.name]
  );

  const { writeContractAsync: _voteProposal } = useWriteContract();
  const { data: lockedVoteBalance, refetch: refetchLockedVoteBalance } =
    useLockedVoteBalance(address);

  const { data: lockedStCeloInVoting, refetch: refetchLockedStCeloInVoting } = useReadContract({
    ...voteContract,
    functionName: 'getLockedStCeloInVoting',
    args: [address as Address],
    query: {
      enabled: !!address,
      select(data) {
        return new StCelo(data);
      },
    },
  });

  // This is based on the following lines from
  // https://github.com/celo-org/staked-celo/blob/master/contracts/Vote.sol
  /*
    uint256 stakedCeloBalance = stakedCelo.balanceOf(accountVoter) +
        stakedCelo.lockedVoteBalanceOf(accountVoter);
    if (stakedCeloBalance == 0) {
        revert NoStakedCelo(accountVoter);
    }
    uint256 totalWeights = yesVotes + noVotes + abstainVotes;
    if (totalWeights > toCelo(stakedCeloBalance)) {
        revert NotEnoughStakedCelo(accountVoter);
    }
  */
  const stakedCeloBalance =
    (lockedVoteBalance?.toBigInt() || 0n) + (stCeloBalance?.toBigInt() || 0n);
  const { data: voteWeight, refetch: refetchVoteWeight } = useReadContract({
    ...managerContract,
    functionName: 'toCelo',
    args: [stakedCeloBalance],
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
        showErrorToast('Insufficient StCelo balance.');
        callbacks?.onSent?.();
        return;
      }

      transactionEvent({
        action: 'voteProposal',
        status: 'initiated_transaction',
        value: vote,
      });
      try {
        const tx = await _voteProposal({
          authorizationList: [],
          ...managerContract,
          address: managerContract.address!,
          functionName: 'voteProposal',
          args: [
            BigInt(proposal.proposalID),
            BigInt(proposal.index),
            vote === VoteType.yes ? voteWeight : 0n,
            vote === VoteType.no ? voteWeight : 0n,
            vote === VoteType.abstain ? voteWeight : 0n,
          ],
        });
        if (!tx) {
          throw new Error('Something went wrong, hash couldnt be fetched');
        }
        await publicClient!.waitForTransactionReceipt({ hash: tx });
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
            : (e as Error).message
        );
      } finally {
        callbacks?.onSent?.();
        void refetchLockedVoteBalance();
        void refetchLockedStCeloInVoting();
        void refetchVoteWeight();
      }
    },
    [
      address,
      suggestedGasPrice,
      voteWeight,
      _voteProposal,
      refetchLockedVoteBalance,
      refetchLockedStCeloInVoting,
      refetchVoteWeight,
      publicClient,
    ]
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

  const { writeContractAsync: _unlockVoteBalance } = useWriteContract();

  const [unlockVoteBalance] = useAsyncCallback(
    async (callbacks?: TxCallbacks) => {
      if (!address || !_unlockVoteBalance || !publicClient || !stakedCeloContract) {
        throw new Error('vote called before loading completed');
      }
      try {
        const txHash = await _unlockVoteBalance({
          abi: stakedCeloContract.abi,
          address: stakedCeloContract.address!,
          functionName: 'unlockVoteBalance',
          args: [address as Address],
        });
        if (!txHash) {
          throw new Error('Something went wrong, hash couldnt be fetched');
        }
        await publicClient.waitForTransactionReceipt({ hash: txHash });
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
        void refetchLockedVoteBalance();
        void refetchLockedStCeloInVoting();
        void refetchVoteWeight();
      }
    },
    [
      address,
      refetchLockedVoteBalance,
      refetchLockedStCeloInVoting,
      refetchVoteWeight,
      publicClient,
    ]
  );

  const { writeContractAsync: _revokeVotes } = useWriteContract();

  const [revokeVotes, revokeVotesStatus] = useAsyncCallback(
    async (proposal: SerializedProposal, callbacks?: TxCallbacks) => {
      if (!address || !managerContract || !proposal.index || !publicClient) {
        throw new Error('revoke called before loading completed');
      }
      if (proposal.stage != ProposalStage.Referendum) {
        throw new Error('revoke called on a proposal that is passed');
      }
      transactionEvent({
        action: 'revokeVotes',
        status: 'initiated_transaction',
      });
      try {
        const tx = await _revokeVotes({
          authorizationList: [],
          ...managerContract,
          address: managerContract.address!,
          functionName: 'revokeVotes',
          args: [BigInt(proposal.proposalID), BigInt(proposal.index)],
        });
        if (!tx) {
          throw new Error('Something went wrong, hash couldnt be fetched');
        }
        await publicClient.waitForTransactionReceipt({ hash: tx });
        deleteFromCache(getVoteCacheKey(proposal.proposalID.toString(), address));
        transactionEvent({
          action: 'revokeVotes',
          status: 'signed_transaction',
        });
        showVoteToast({ vote: null, proposalID: proposal.proposalID.toString() });
      } catch (e: unknown) {
        logger.error('revokeVotes error', e);
        showErrorToast(
          (e as Error).message.includes('rejected')
            ? 'User rejected the request'
            : (e as Error).message
        );
      } finally {
        callbacks?.onSent?.();
        void refetchLockedVoteBalance();
        void refetchLockedStCeloInVoting();
        void refetchVoteWeight();
      }
    },
    [
      address,
      suggestedGasPrice,
      refetchLockedVoteBalance,
      refetchLockedStCeloInVoting,
      refetchVoteWeight,
      publicClient,
    ]
  );

  return {
    stakedCeloThatCanVoteBalance: new StCelo(stakedCeloBalance),
    voteProposal,
    voteProposalStatus,
    getProposalVote,
    lockedVoteBalance,
    lockedStCeloInVoting,
    revokeVotes,
    revokeVotesStatus,
    unlockVoteBalance,
  };
};

// returns all stCelo that was ever used for voting but never unlock (including both currently voted on proposals and already expired proposals that account voted on)
export function useLockedVoteBalance(address: string | undefined) {
  const { stakedCeloContract } = useBlockchain();

  return useReadContract({
    ...stakedCeloContract,
    functionName: 'lockedVoteBalanceOf',
    args: [address as Address],
    query: {
      enabled: !!address,
      select(data) {
        return new StCelo(data);
      },
    },
  });
}
