import { useMemo, useState } from 'react';
import { IndicatorIcon } from 'src/components/icons/IndicatorIcon';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Label } from 'src/components/text/Label';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useVote } from 'src/features/governance/hooks/useVote';
import { AccountModal } from 'src/features/wallet/components/AccountModal';
import { NetworkSwitcherModal } from 'src/features/wallet/components/NetworkSwitcherModal';
import chainIdToChain from 'src/utils/chainIdToChain';
import { useChainId } from 'wagmi';

export const WalletButton = () => {
  const { address } = useAccountContext();
  const chainId = useChainId();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const { lockedVoteBalance } = useVote();

  const addressLabel = useMemo(() => {
    return address ? `${address.slice(0, 2)}...${address.slice(-4)}` : '';
  }, [address]);

  const chainLabel = useMemo(() => {
    return chainId ? chainIdToChain(chainId).name : '';
  }, [chainId]);

  const flexClasses = 'inline-flex items-center';
  const paddingClasses = 'py-[2px] md:py-[8px] px-[9px] md:px-[16px]';

  return (
    <div className={`${flexClasses} gap-4`}>
      <span
        className={`${flexClasses} cursor-pointer bg-secondary text-color-secondary rounded-[100px] ${paddingClasses}`}
        onClick={() => setIsNetworkModalOpen((bool) => !bool)}
      >
        <IndicatorIcon classes="pr-[8px] text-color-green" /> <Label>{chainLabel}</Label>
      </span>
      <span
        className={`${flexClasses} cursor-pointer bg-secondary text-color-secondary rounded-[100px] ${paddingClasses}`}
        onClick={() => setIsAccountModalOpen((bool) => !bool)}
      >
        {lockedVoteBalance?.gt(0) ? (
          <ThemedIcon
            classes="fill custom--primary-color-filter"
            name="info"
            alt={`locked stCelo in voting info`}
            height={16}
            width={16}
          />
        ) : (
          <IndicatorIcon classes="pr-[8px] text-color-green" />
        )}{' '}
        <Label classes="pl-2">{addressLabel}</Label>
      </span>
      <AccountModal isOpen={isAccountModalOpen} close={() => setIsAccountModalOpen(false)} />
      <NetworkSwitcherModal
        isOpen={isNetworkModalOpen}
        close={() => setIsNetworkModalOpen(false)}
      />
    </div>
  );
};
