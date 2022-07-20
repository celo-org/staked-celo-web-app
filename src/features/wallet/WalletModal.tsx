import { PropsWithChildren, useCallback } from 'react';
import { Modal } from 'src/components/modals/Modal';
import { useAccount } from 'src/hooks/useAccount';
import { useWallet } from './useWallet';

interface WalletModalActionProps {
  action: () => void;
}

const WalletModalAction = ({ children, action }: PropsWithChildren<WalletModalActionProps>) => {
  return (
    <button className="text-left font-bold text-lg m-4" onClick={action}>
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
  const { address } = useAccount();

  const changeWalletWithClose = useCallback(async () => {
    const walletChanged = await changeWallet();
    if (walletChanged) close();
  }, [changeWallet, close]);

  const disconnectWalletWithClose = useCallback(async () => {
    await disconnectWallet();
    close();
  }, [disconnectWallet, close]);

  return (
    <Modal
      isOpen={changingWallet ? false : isOpen}
      screenReaderLabel="Connect wallet modal"
      close={close}
      contentStyle={{
        width: '90%',
        height: '70%',
        maxWidth: '350px',
        maxHeight: '500px',
      }}
    >
      <div className="flex flex-col flex-grow">
        <header className="font-semibold text-xl mb-8">Wallet Info</header>
        <section className="flex-grow">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Address</span>
            <button
              className="underline"
              onClick={() => navigator.clipboard.writeText(address || '')}
            >
              Copy
            </button>
          </div>
          {address}
        </section>
        <WalletModalAction action={changeWalletWithClose}>Change Wallet</WalletModalAction>
        <WalletModalAction action={disconnectWalletWithClose}>Disconnect</WalletModalAction>
      </div>
    </Modal>
  );
};
