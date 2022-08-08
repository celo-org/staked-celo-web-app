import { useMemo, useState } from 'react';
import { IndicatorIcon } from 'src/components/icons/IndicatorIcon';
import { Label } from 'src/components/text/Label';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { WalletModal } from './WalletModal';

export const WalletButton = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { address } = useAccountContext();

  const addressLabel = useMemo(() => {
    return address ? `${address.slice(0, 2)}...${address.slice(-4)}` : '';
  }, [address]);

  const flexClasses = 'inline-flex items-center';
  const paddingClasses = 'py-[2px] md:py-[8px] px-[9px] md:px-[16px]';

  return (
    <>
      <span
        className={`${flexClasses} cursor-pointer bg-secondary text-color-secondary rounded-[100px] ${paddingClasses}`}
        onClick={() => setIsModalOpened(true)}
      >
        <IndicatorIcon classes="pr-[8px]" /> <Label>{addressLabel}</Label>
      </span>
      <WalletModal isOpen={isModalOpened} close={() => setIsModalOpened(false)} />
    </>
  );
};
