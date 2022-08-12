import { PropsWithChildren } from 'react';
import { Modal } from './Modal';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  callout: string;
}

export const CalloutModal = ({
  isOpen,
  close,
  callout,
  children,
}: PropsWithChildren<ModalProps>) => {
  return (
    <Modal isOpen={isOpen} screenReaderLabel={callout} close={close}>
      <div
        className="flex flex-col items-center bg-callout-modal px-[24px] py-[32px]"
        style={{
          boxShadow: '0px 0px 16px 0px #39444840',
        }}
      >
        <div className="font-light text-center text-color-primary my-[24px] text-[20px] leading-[24px]">
          {children}
        </div>
        <div
          className="cursor-pointer py-[8px] text-[18px] leading-[24px] text-color-callout-modal text-center"
          onClick={close}
        >
          Dismiss
        </div>
      </div>
    </Modal>
  );
};
