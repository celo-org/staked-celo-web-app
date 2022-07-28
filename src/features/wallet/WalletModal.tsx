import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Modal } from 'src/components/modals/Modal';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useWallet } from './useWallet';

interface WalletModalActionProps {
  action: () => void;
}

const WalletModalAction = ({ children, action }: PropsWithChildren<WalletModalActionProps>) => {
  return (
    <button className="text-left text-xl font-normal my-2 underline" onClick={action}>
      {children}
    </button>
  );
};

interface WalletModalProps {
  isOpen: boolean;
  close: () => void;
  screenReaderLabel?: string;
}

export const WalletModal = ({ isOpen, close }: WalletModalProps) => {
  const { changeWallet, disconnectWallet, changingWallet } = useWallet();
  const { address } = useAccountContext();

  const changeWalletWithClose = useCallback(async () => {
    const walletChanged = await changeWallet();
    if (walletChanged) close();
  }, [changeWallet, close]);

  const disconnectWalletWithClose = useCallback(async () => {
    await disconnectWallet();
    close();
  }, [disconnectWallet, close]);

  const displayAddress: string = useMemo(() => {
    if (!address) return '';
    const relevantNumbers = address.slice(2);
    return `0x ${relevantNumbers.replaceAll(/([0-9a-zA-Z]{4})/g, '$1 ')}`;
  }, [address]);

  return (
    <Modal
      isOpen={changingWallet ? false : isOpen}
      screenReaderLabel="Connect wallet modal"
      close={close}
      contentStyle={{
        width: '90%',
        height: '40%',
        maxWidth: '350px',
        minHeight: '400px',
        maxHeight: '500px',
      }}
      header={<span className="text-green">&bull; Connected</span>}
    >
      <div className="flex flex-col flex-grow text-gray-900">
        <section className="flex-grow">
          <div className="flex mt-8 mb-2">
            <span className="font-regular text-2xl mr-2">Wallet address</span>
            <button
              className="underline"
              onClick={() => navigator.clipboard.writeText(address || '')}
            >
              Copy
            </button>
          </div>
          <span className="text-base">{displayAddress}</span>
        </section>
        <WalletModalAction action={changeWalletWithClose}>Change Wallet</WalletModalAction>
        <WalletModalAction action={disconnectWalletWithClose}>Disconnect</WalletModalAction>
      </div>
    </Modal>
  );
};
