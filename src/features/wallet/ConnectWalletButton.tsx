import { useMemo, useState } from 'react';
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
      <button
        className="text-secondary inline-flex flex-col"
        onClick={() => setIsModalOpened(true)}
      >
        <span className="text-lg">
          <span className="text-green">&bull;</span> {addressLabel}
        </span>
      </button>
      <WalletModal isOpen={isModalOpened} close={() => setIsModalOpened(false)} />
    </>
  );
};
