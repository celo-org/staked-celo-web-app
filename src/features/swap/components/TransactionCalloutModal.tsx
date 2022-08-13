import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { CalloutModal } from 'src/components/modals/CalloutModal';

interface TransactionCalloutModalProps {
  isOpened: boolean;
  close: () => void;
}

export const TransactionCalloutModal = ({ isOpened, close }: TransactionCalloutModalProps) => {
  return (
    <CalloutModal
      isOpen={isOpened}
      close={close}
      callout="Please approve the transaction in your wallet"
    >
      <div className="flex flex-col items-center mb-[24px]">
        <ThemedIcon
          name="spinner-purple"
          width={120}
          height={120}
          alt="Loading"
          classes="animate-spin"
        />
      </div>
      Please approve the transaction in your wallet
    </CalloutModal>
  );
};
