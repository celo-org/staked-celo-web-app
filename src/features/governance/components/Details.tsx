import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ContainerSecondaryBG } from 'src/components/containers/ContainerSecondaryBG';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { LinkOut } from 'src/components/text/LinkOut';
import { TertiaryCallout } from 'src/components/text/TertiaryCallout';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { Choices } from 'src/features/governance/components/Choices';
import { StagePill } from 'src/features/governance/components/StagePill';
import { VoteButton } from 'src/features/governance/components/VoteButton';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { useVote } from 'src/features/governance/hooks/useVote';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode, VoteType } from 'src/types';
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
  const { stCeloBalance, loadBalances, isConnected } = useAccountContext();
  const { voteProposal, voteProposalStatus, getHasVoted, getHasVotedStatus, getProposalVote } =
    useVote();

  useEffect(() => {
    // if (isConnected) void loadBalances();
  }, [loadBalances, isConnected]);

  const [currentVote, setCurrentVote] = useState<VoteType>();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);

  const onVoteChange = useCallback((voteType: VoteType) => {
    setCurrentVote(voteType);
  }, []);

  const pastVote = useMemo(() => {
    return getProposalVote(proposal.proposalID.toString());
  }, [getProposalVote, proposal.proposalID]);

  const onVote = useCallback(async () => {
    if (!currentVote || hasVoted) return;
    setTransactionModalOpen(true);
    await voteProposal(proposal, currentVote, { onSent: () => setTransactionModalOpen(false) });
    setHasVoted(true);
  }, [currentVote, hasVoted, voteProposal, proposal]);

  useEffect(() => {
    void getHasVoted(proposal)
      .then((didVote) => {
        setHasVoted((isVoted) => isVoted || pastVote !== null || didVote);
      })
      .catch(() => setHasVoted((isVoted) => isVoted || pastVote !== null));
  }, [pastVote, getHasVoted, proposal]);

  const loaded = Boolean(proposal);
  const fetchError = Boolean(loaded && !proposal?.parsedYAML);

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
                    : `#${proposal!.parsedYAML!.cgp} ${proposal!.parsedYAML!.title}`}
                </div>
                <LinkOut classes="m-2" href={proposal!.metadata.descriptionURL}>
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
                {stCeloBalance.displayAsBase()} stCELO will vote {currentVote} for Proposal #
                {proposal.parsedYAML?.cgp}
              </TertiaryCallout>
            )}
            {pastVote && (
              <TertiaryCallout classes="px-[8px]">
                {pastVote.weight} stCELO voted {pastVote.vote} for Proposal #
                {proposal.parsedYAML?.cgp}
              </TertiaryCallout>
            )}
            {!hasVoted && (
              <div className="w-full px-4 py-2">
                <VoteButton
                  disabled={!loaded || currentVote === undefined || hasVoted}
                  pending={voteProposalStatus.isExecuting || getHasVotedStatus.isExecuting}
                  onVote={onVote}
                />
              </div>
            )}
          </>
        ) : null}
        <TransactionCalloutModal
          isOpened={transactionModalOpen}
          close={() => setTransactionModalOpen(false)}
        />
      </ContainerSecondaryBG>
    </CenteredLayout>
  );
};
