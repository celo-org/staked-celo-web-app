import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCallback, useEffect, useState } from 'react';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { AsyncButton } from 'src/components/buttons/AsyncButton';
import { ContainerSecondaryBG } from 'src/components/containers/ContainerSecondaryBG';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { LinkOut } from 'src/components/text/LinkOut';
import { TertiaryCallout } from 'src/components/text/TertiaryCallout';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { Choices } from 'src/features/governance/components/Choices';
import CurrentVotingBalanceDetails from 'src/features/governance/components/CurrentVotingBalanceDetails';
import { StagePill } from 'src/features/governance/components/StagePill';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { useVote } from 'src/features/governance/hooks/useVote';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode, VoteType } from 'src/types';
import { restrictToCeloGovernanceLink } from 'src/utils/proposals';
import { StCelo } from 'src/utils/tokens';
import { BackToListButton } from '../../../components/buttons/BackToListButton';

interface Props {
  proposal: SerializedProposal;
}
// From contractkit
export enum ProposalStage {
  None = 'None',
  Queued = 'Queued',
  Approval = 'Approval',
  Referendum = 'Referendum',
  Execution = 'Execution',
  Expiration = 'Expiration',
}

export const Details = ({ proposal }: Props) => {
  const { loadBalances, isConnected, address } = useAccountContext();
  const {
    stakedCeloThatCanVoteBalance,
    voteProposal,
    voteProposalStatus,
    getProposalVote,
    lockedVoteBalance,
    lockedStCeloInVoting,
    revokeVotes,
    revokeVotesStatus,
    unlockVoteBalance,
  } = useVote();

  useEffect(() => {
    if (isConnected) void loadBalances?.();
  }, [loadBalances, isConnected, proposal]);

  const [currentVote, setCurrentVote] = useState<VoteType>();
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);

  const onVoteChange = useCallback((voteType: VoteType) => {
    setCurrentVote(voteType);
  }, []);

  const [pastVote, setPastVote] = useState<{ vote: string; weight: string } | null>(null);
  useEffect(() => {
    if (!proposal?.proposalID) return;

    void getProposalVote(proposal.proposalID.toString(), address!).then((vote) => {
      setPastVote(vote);
    });
  }, [address, getProposalVote, proposal?.proposalID]);

  const hasVoted = !!pastVote;

  const onVote = useCallback(async () => {
    if (!currentVote || hasVoted) return;
    setTransactionModalOpen(true);
    await voteProposal(proposal, currentVote, { onSent: () => setTransactionModalOpen(false) });
    const recentVote = await getProposalVote(proposal.proposalID.toString(), address!);
    setPastVote(recentVote);
  }, [currentVote, hasVoted, voteProposal, proposal, getProposalVote, address]);

  const onRevoke = useCallback(async () => {
    if (!hasVoted) return;
    setTransactionModalOpen(true);
    await revokeVotes(proposal, { onSent: () => setTransactionModalOpen(false) });
    setPastVote(null);
  }, [hasVoted, proposal, revokeVotes]);

  const loaded = Boolean(proposal);
  const fetchError = Boolean(loaded && !proposal?.parsedYAML);
  const saferDescriptionUrl = restrictToCeloGovernanceLink(proposal?.metadata.descriptionURL);
  return (
    <CenteredLayout classes="px-[24px]">
      <ContainerSecondaryBG>
        <div className="flex bg-primary p-[8px] rounded-[16px] w-full">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between w-full flex-grow">
              <BackToListButton mode={Mode.governance} />
              {loaded && <StagePill stage={proposal!.stage} />}
            </div>
            {loaded ? (
              <>
                <div className="text-[18px] text-color-primary">
                  {fetchError
                    ? 'Failed to fetch proposal title'
                    : `CGP-${proposal!.parsedYAML!.cgp} (#${proposal!.proposalID} on-chain) - ${
                        proposal!.parsedYAML!.title
                      }`}
                </div>
                <LinkOut classes="m-2" href={saferDescriptionUrl}>
                  view info
                </LinkOut>
              </>
            ) : (
              <div className="py-6 flex justify-center w-full">
                <ThemedIcon
                  classes="animate-spin"
                  name="spinner-contrast"
                  alt="Spinner"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </div>
        </div>

        {!isConnected ? (
          <ConnectButton />
        ) : ProposalStage.Referendum === proposal?.stage ? (
          <>
            <Choices
              disabled={!loaded || hasVoted || voteProposalStatus.isExecuting}
              onChange={onVoteChange}
              voteType={currentVote}
            />
            {currentVote !== undefined && !hasVoted && (
              <TertiaryCallout classes="px-[8px]">
                {stakedCeloThatCanVoteBalance.displayAsBase()} stCELO will vote {currentVote} for
                Proposal #{proposal.parsedYAML?.cgp}
              </TertiaryCallout>
            )}
            {!hasVoted && (
              <div className="w-full px-4 py-2">
                <AsyncButton
                  disabled={!loaded || currentVote === undefined || hasVoted}
                  pending={voteProposalStatus.isExecuting}
                  onClick={onVote}
                  text="Vote"
                />
              </div>
            )}
            {hasVoted && (
              <div className="w-full px-4 py-2">
                <AsyncButton
                  disabled={!loaded || !hasVoted}
                  pending={revokeVotesStatus.isExecuting}
                  onClick={onRevoke}
                  text="Revoke Votes"
                />
              </div>
            )}
          </>
        ) : null}
        {pastVote ? (
          <TertiaryCallout classes="px-[8px]">
            {new StCelo(pastVote.weight).displayAsBase()} stCELO voted {pastVote.vote} for Proposal
            #{proposal.parsedYAML?.cgp}
          </TertiaryCallout>
        ) : hasVoted ? (
          <TertiaryCallout classes="px-[8px]">
            {address} voted for Proposal #{proposal.parsedYAML?.cgp}
          </TertiaryCallout>
        ) : null}
        <TransactionCalloutModal
          isOpened={transactionModalOpen}
          close={() => setTransactionModalOpen(false)}
        />
      </ContainerSecondaryBG>
      <CurrentVotingBalanceDetails
        lockedVoteBalance={lockedVoteBalance}
        lockedStCeloInVoting={lockedStCeloInVoting}
        unlockVoteBalance={unlockVoteBalance}
      />
    </CenteredLayout>
  );
};
