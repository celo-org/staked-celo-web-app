import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FormEvent, useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { BackToListButton } from 'src/components/buttons/BackToListButton';
import { SubmitButton } from 'src/components/buttons/SubmitButton';
import { ContainerSecondaryBG } from 'src/components/containers/ContainerSecondaryBG';
import { LinkOut } from 'src/components/text/LinkOut';
import { TertiaryCallout } from 'src/components/text/TertiaryCallout';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { ADDRESS_ZERO, EXPLORER_ALFAJORES_URL, EXPLORER_MAINNET_URL } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';

import { useChangeStrategy } from 'src/features/validators/hooks/useChangeStrategy';
import { removeAddressMiddle } from 'src/features/validators/removeAddressMiddle';
import { useIsTransitioning } from 'src/hooks/useIsTransitioning';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';
import { useChainId } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';
interface Props {
  groupAddress: string;
  name?: string;
}

export const Details = ({ groupAddress, name }: Props) => {
  const isTransitioning = useIsTransitioning();
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const chainId = useChainId();
  const { loadBalances, stCeloBalance, isConnected, strategy } = useAccountContext();
  const displayName = name || removeAddressMiddle(groupAddress);
  const { changeStrategy } = useChangeStrategy();

  useEffect(() => {
    if (isConnected) {
      // void loadBalances();
    }
  }, [loadBalances, isConnected]);

  const [onSubmit, { isExecuting }] = useAsyncCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setTransactionModalOpen(true);
      return changeStrategy(groupAddress);
    },
    [groupAddress]
  );

  const explorerLink = chainId === celoAlfajores.id ? EXPLORER_ALFAJORES_URL : EXPLORER_MAINNET_URL;
  const infoLink =
    groupAddress === ADDRESS_ZERO
      ? 'https://docs.stcelo.xyz/voting-for-validator-groups'
      : `https://thecelo.com/groupDetail/${groupAddress}`;

  return (
    <form id={`group-${groupAddress}`} className="w-full flex" onSubmit={onSubmit}>
      <CenteredLayout classes={`px-[24px] ${isTransitioning && 'animate-pulse'}`}>
        <ContainerSecondaryBG>
          <div className="flex bg-primary p-[8px] rounded-[16px] w-full">
            <div className="flex flex-col gap-4 w-full">
              <BackToListButton mode={Mode.validators} />
              <label className={`${nameSize(displayName)} truncate`}>{displayName}</label>
              <a
                href={`${explorerLink}/address/${groupAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm"
              >
                {groupAddress}
              </a>
              <LinkOut classes="m-2" href={infoLink}>
                view info
              </LinkOut>
            </div>
          </div>
          <TertiaryCallout classes="pl-1">
            {isConnected && (
              <>
                {'Your '}
                {stCeloBalance.displayAsBase(true)}
                {' stCELO '}
                {strategy === groupAddress ? 'is voting for' : 'will vote for'}{' '}
                {truncateIfLong(displayName)}
              </>
            )}
          </TertiaryCallout>
        </ContainerSecondaryBG>
        <div className="flex justify-center mt-[16px]">
          {isConnected ? (
            <SubmitButton
              mode={Mode.validators}
              pending={isExecuting}
              disabled={stCeloBalance.eq(0)}
            />
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
