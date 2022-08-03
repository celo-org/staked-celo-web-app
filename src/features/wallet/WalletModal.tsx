import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Label } from 'src/components/elements/Label';
import { IndicatorIcon } from 'src/components/icons/IndicatorIcon';
import { Modal } from 'src/components/modals/Modal';
import { useAccountContext } from 'src/providers/AccountProvider';
import { useWallet } from './useWallet';

interface WalletModalActionProps {
  action: () => void;
}

const WalletModalAction = ({ children, action }: PropsWithChildren<WalletModalActionProps>) => {
  return (
    <button className="text-left text-[16px] leading-[24px] my-[8px] underline" onClick={action}>
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
      header={
        <div className="flex items-center">
          <IndicatorIcon classes="mr-[8px]" />
          <Label classes="text-green">Connected</Label>
        </div>
      }
    >
      <div className="flex flex-col flex-grow">
        <section className="flex-grow">
          <div className="flex mt-8 mb-2">
            <h2 className="font-medium text-[20px] leading-[24px] mr-[8px]">Wallet address</h2>
            <button
              className="underline text-secondary text-[14px] leading-[100%]"
              onClick={() => navigator.clipboard.writeText(address || '')}
            >
              Copy
            </button>
          </div>
          <h2 className="text-base text-[16px] leading-[24px]">{displayAddress}</h2>
        </section>
        <WalletModalAction action={changeWalletWithClose}>Change Wallet</WalletModalAction>
        <WalletModalAction action={disconnectWalletWithClose}>Disconnect</WalletModalAction>
      </div>
    </Modal>
  );
};
