import { useMemo, useState } from 'react';
import { useWallet } from 'src/features/wallet/useWallet';
import WalletModal from 'src/features/wallet/WalletModal';

export function ConnectButton() {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { address } = useWallet();

  const addressLabel = useMemo(() => {
    return address ? `${address.slice(0, 2)}...${address.slice(-4)}` : '';
  }, [address]);

  return (
    <>
      <button className="inline-flex flex-col" onClick={() => setIsModalOpened(true)}>
        <span className="font-semibold">Connected</span>
        <span className="underline text-lg">{addressLabel}</span>
      </button>
      <WalletModal isOpen={isModalOpened} close={() => setIsModalOpened(false)} />
    </>
  );
}
