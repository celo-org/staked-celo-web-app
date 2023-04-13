import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import { useCallback, useEffect, useState } from 'react';
import { ConnectButton } from 'src/components/buttons/ConnectButton';
import { ContainerSecondaryBG } from 'src/components/containers/ContainerSecondaryBG';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { LinkOut } from 'src/components/text/LinkOut';
import { TertiaryCallout } from 'src/components/text/TertiaryCallout';
import { useAccountAddress } from 'src/contexts/account/useAddress';
import { useAccountBalances } from 'src/contexts/account/useBalances';
import { Choices } from 'src/features/governance/components/Choices';
import { StagePill } from 'src/features/governance/components/StagePill';
import { VoteButton } from 'src/features/governance/components/VoteButton';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode, VoteType } from 'src/types';
import { BackToListButton } from '../../../components/buttons/BackToListButton';

import type { Proposal } from '../data/Proposal';

interface Props {
  proposal: Proposal;
}

export const Details = ({ proposal }: Props) => {
  const { address, isConnected } = useAccountAddress();
  const { stCeloBalance, loadBalances } = useAccountBalances(address);

  useEffect(() => {
    if (isConnected) void loadBalances();
  }, [loadBalances, isConnected]);

  const [currentVote, setCurrentVote] = useState<VoteType>();

  const onVoteChange = useCallback((voteType: VoteType) => {
    setCurrentVote(voteType);
  }, []);
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
        ) : (
          ProposalStage.Referendum === proposal?.stage && (
            <>
              <Choices disabled={!loaded} onChange={onVoteChange} voteType={currentVote} />
              {currentVote !== undefined && (
                <TertiaryCallout>
                  {stCeloBalance.displayAsBase()} stCELO will vote {currentVote} for Proposal #
                  {proposal.parsedYAML?.cgp}
                </TertiaryCallout>
              )}
              <div className="w-full px-4 py-2">
                <VoteButton disabled={!loaded || currentVote === undefined} pending={false} />
              </div>
            </>
          )
        )}
      </ContainerSecondaryBG>
    </CenteredLayout>
  );
};
