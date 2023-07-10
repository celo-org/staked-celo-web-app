import { useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';
import { IndicatorIcon } from 'src/components/icons/IndicatorIcon';
import { Label } from 'src/components/text/Label';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import chainIdToChain from 'src/utils/chainIdToChain';
import { useChainId } from 'wagmi';

export const WalletButton = () => {
  const { address } = useAccountContext();
  const chainId = useChainId();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

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
        onClick={() => openChainModal?.()}
      >
        <IndicatorIcon classes="pr-[8px]" /> <Label>{chainLabel}</Label>
      </span>
      <span
        className={`${flexClasses} cursor-pointer bg-secondary text-color-secondary rounded-[100px] ${paddingClasses}`}
        onClick={() => openAccountModal?.()}
      >
        <IndicatorIcon classes="pr-[8px]" /> <Label>{addressLabel}</Label>
      </span>
    </div>
  );
};
