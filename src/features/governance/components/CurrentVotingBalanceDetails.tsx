import { PropsWithChildren, useCallback, useState } from 'react';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { Pill } from 'src/components/pills/Pill';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useVote } from 'src/features/governance/hooks/useVote';
import { Option } from 'src/types';
import { StCelo, Token } from 'src/utils/tokens';

const Detail = ({
  title,
  value,
  unlock,
  inModal,
  children,
}: PropsWithChildren<{
  title: string;
  unlock?: () => void;
  inModal?: boolean;
  value?: Token;
}>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={title}>
      <div className="flex justify-between items-center font-normal mb-[4px]">
        <span className="inline-flex items-center">
          <span className="text-[15px] leading-[24px]">{title}</span>
          <span className="inline-flex items-center ml-[8px]">
            <ThemedIcon
              classes={`cursor-pointer`}
              name="info"
              alt={`locked stCelo in voting info`}
              height={16}
              width={16}
              onClick={() => setIsOpen(true)}
            />
          </span>
        </span>
        <span>{value?.convertToBase().toFixed()}</span>
      </div>
      {Boolean(unlock) && (
        <div className="flex gap-2 items-center justify-between mb-2">
          <i className="inline-flex">of which {value?.convertToBase().toFixed()} can be unlocked</i>
          <Button onClick={unlock} classes="h-[24px]">
            <Pill classes={inModal ? 'bg-primary' : 'bg-secondary'}>Unlock</Pill>
          </Button>
        </div>
      )}
      <InfoModal title={title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {children}
      </InfoModal>
    </li>
  );
};

interface Props {
  lockedVoteBalance: Option<StCelo>;
  lockedStCeloInVoting: Option<StCelo>;
  unlockVoteBalance: Option<ReturnType<typeof useVote>['unlockVoteBalance']>;
  inModal?: boolean;
}

const CurrentVotingBalanceDetails = ({
  lockedVoteBalance,
  lockedStCeloInVoting,
  unlockVoteBalance,
  inModal,
}: Props) => {
  const { reloadProtocolContext } = useProtocolContext();
  const [isCalloutModalOpened, setIsCalloutModalOpened] = useState(false);
  const eitherLoading = Boolean(!lockedVoteBalance || !lockedStCeloInVoting);
  const bothZero = lockedVoteBalance?.eq(0) && lockedStCeloInVoting?.eq(0);

  const unlock = useCallback(() => {
    void unlockVoteBalance?.({
      onSent: () => {
        setIsCalloutModalOpened(false);
        void reloadProtocolContext();
      },
    });
  }, [reloadProtocolContext, unlockVoteBalance]);

  if (!inModal && (eitherLoading || bothZero)) return null;

  const showLockedVoteBalance =
    inModal || (lockedVoteBalance?.gt(0) && !lockedVoteBalance?.eq(lockedStCeloInVoting!));
  const showLockedStCeloInVoting = inModal || lockedStCeloInVoting?.gt(0);

  return (
    <>
      <ul
        className={
          inModal ? 'text-[15px]' : 'text-color-secondary text-[15px] leading-[24px] mt-[24px]'
        }
      >
        {showLockedVoteBalance && (
          <Detail
            title={'Locked stCELO'}
            value={lockedVoteBalance}
            unlock={lockedVoteBalance?.gt(0) ? unlock : undefined}
            inModal={inModal}
          >
            When a you vote on a governance proposal, your stCELO balance gets locked. <br />
            This stCELO is not automatically unlocked after a proposal voting period has elapsed and
            explains why you may think your funds are missing. While your stCELO balance is locked,
            you cannot see that balance or transfer it.
          </Detail>
        )}
        {showLockedStCeloInVoting && (
          <Detail title={'Locked stCELO in voting'} value={lockedStCeloInVoting} inModal={inModal}>
            When a you vote on a governance proposal, your stCELO balance gets locked. <br />
            You may not unlock your stCELO locked in voting as long as the proposal hasn&apos;t
            expired.
          </Detail>
        )}
      </ul>

      <TransactionCalloutModal
        isOpened={isCalloutModalOpened}
        close={() => setIsCalloutModalOpened(false)}
      />
    </>
  );
};
export default CurrentVotingBalanceDetails;
