import { FormEvent, useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { BackToListButton } from 'src/components/buttons/BackToListButton';
import { ConnectButton } from 'src/components/buttons/ConnectButton';
import { SubmitButton } from 'src/components/buttons/SubmitButton';
import { ContainerSecondaryBG } from 'src/components/containers/ContainerSecondaryBG';
import { LinkOut } from 'src/components/text/LinkOut';
import { TertiaryCallout } from 'src/components/text/TertiaryCallout';
import { ADDRESS_ZERO } from 'src/config/consts';
import { useAccountAddress } from 'src/contexts/account/useAddress';
import { useAccountBalances } from 'src/contexts/account/useBalances';
import { removeAddressMiddle } from 'src/features/validators/removeAddressMiddle';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import logger from 'src/services/logger';
import { Mode } from 'src/types';

interface Props {
  groupAddress: string;
  name?: string;
}

export const Details = ({ groupAddress, name }: Props) => {
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const { address: myAddress, isConnected } = useAccountAddress();
  const { stCeloBalance, loadBalances } = useAccountBalances(myAddress);
  const displayName = name || removeAddressMiddle(groupAddress);

  useEffect(() => {
    if (isConnected) {
      void loadBalances();
    }
  }, [loadBalances, isConnected]);

  const [onSubmit, { isExecuting }] = useAsyncCallback(async (event: FormEvent) => {
    event.preventDefault();
    setTransactionModalOpen(true);
    logger.warn('Pledging staked celo');
    // Manager.changeStrategy(groupAddress)
    return;
  }, []);

  const infoLink =
    groupAddress === ADDRESS_ZERO
      ? 'https://docs.stcelo.xyz/voting-for-validator-groups'
      : `https://thecelo.com/groupDetail/${groupAddress}`;

  return (
    <form id={`group-${groupAddress}`} className="w-full flex" onSubmit={onSubmit}>
      <CenteredLayout classes="px-[24px]">
        <ContainerSecondaryBG>
          <div className="flex bg-primary p-[8px] rounded-[16px] w-full">
            <div className="flex flex-col gap-4 w-full">
              <BackToListButton mode={Mode.validators} />
              <label className={`${nameSize(displayName)} truncate`}>{displayName}</label>
              <span className="text-sm">{groupAddress}</span>
              <LinkOut classes="m-2" href={infoLink}>
                view info
              </LinkOut>
            </div>
          </div>
          <TertiaryCallout>
            {isConnected && (
              <>
                {stCeloBalance.displayAsBase(true)} will vote for {truncateIfLong(displayName)}
              </>
            )}
          </TertiaryCallout>
        </ContainerSecondaryBG>
        <div className="flex justify-center mt-[16px]">
          {isConnected ? (
            <SubmitButton mode={Mode.validators} pending={isExecuting} />
          ) : (
            <ConnectButton />
          )}
        </div>
      </CenteredLayout>
      <TransactionCalloutModal
        isOpened={isTransactionModalOpen}
        close={() => setTransactionModalOpen(false)}
      />
    </form>
  );
};

function nameSize(name: string) {
  if (name.length < 30) {
    return 'text-2xl';
  } else if (name.length < 40) {
    return 'text-lg';
  } else {
    return 'text-base';
  }
}

function truncateIfLong(word: string) {
  const maxLength = 26;
  if (word.length < maxLength) {
    return word;
  }
  return word.slice(0, maxLength - 2) + '…';
}
