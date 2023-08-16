import { PropsWithChildren, useCallback, useState } from 'react';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useVote } from 'src/features/governance/hooks/useVote';
import { Option } from 'src/types';
import { StCelo, Token } from 'src/utils/tokens';

const Detail = ({ title, value, children }: PropsWithChildren<{ title: string; value: Token }>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={title} className="flex justify-between font-normal mb-[4px]">
      <span className="inline-flex items-center">
        <span className="text-[15px] leading-[24px]">{title}</span>
        <span className="inline-flex items-center ml-[8px]">
          <ThemedIcon
            classes="cursor-pointer"
            name="info"
            alt={`locked stCelo in voting info`}
            height={16}
            width={16}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span>{value.convertToBase().toFixed()}</span>
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
}

const CurrentVotingBalanceDetails = ({
  lockedVoteBalance,
  lockedStCeloInVoting,
  unlockVoteBalance,
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

  if (eitherLoading || bothZero) return null;

  return (
    <>
      <ul className="text-color-secondary mt-[24px] text-[15px] leading-[24px]">
        {lockedVoteBalance &&
          lockedVoteBalance.isGreaterThan(0) &&
          !lockedVoteBalance.eq(lockedStCeloInVoting!) && (
            <Detail title={'Locked stCELO'} value={lockedVoteBalance}>
              <i className="inline-flex mb-4 text-color-primary-callout">
                You have {lockedVoteBalance.convertToBase().toFixed()} unlockable stCELO
              </i>
              <br />
              When a you vote on a governance proposal, your stCELO balance gets locked. <br />
              This stCELO is not automatically unlocked after a proposal voting period has elapsed
              and explains why you may think your funds are mising. While your stCELO balance is
              locked, you cannot see that balance or transfer it.
              <Button onClick={unlock}>
                Click here to unlock your {lockedVoteBalance.convertToBase().toFixed()} stCELO.
              </Button>
            </Detail>
          )}
        {lockedStCeloInVoting && lockedStCeloInVoting.isGreaterThan(0) && (
          <Detail title={'Locked stCELO in voting'} value={lockedStCeloInVoting}>
            <i className="inline-flex mb-4 text-color-primary-callout">
              You have {lockedStCeloInVoting.convertToBase().toFixed()} locked stCELO currently used
              in voting
            </i>
            <br />
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
