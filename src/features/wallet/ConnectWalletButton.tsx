import { useMemo, useState } from 'react';
import { IndicatorIcon } from 'src/components/icons/IndicatorIcon';
import { useAccountContext } from 'src/providers/AccountProvider';
import { WalletModal } from './WalletModal';

export const ConnectWalletButton = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { address } = useAccountContext();

  const addressLabel = useMemo(() => {
    return address ? `${address.slice(0, 2)}...${address.slice(-4)}` : '';
  }, [address]);

  return (
    <>
      <label
        className="inline-flex items-center py-[2px] px-[9px] rounded-xl bg-secondary text-secondary"
        onClick={() => setIsModalOpened(true)}
      >
        <IndicatorIcon classes="pr-[8px]" />{' '}
        <span className="font-medium text-[14px] leading-[16px]">{addressLabel}</span>
      </label>
      <WalletModal isOpen={isModalOpened} close={() => setIsModalOpened(false)} />
    </>
  );
};
