import Image from 'next/image';
import { PropsWithChildren } from 'react';
import ReactModal from 'react-modal';
import Close from 'src/images/icons/close.svg';

interface ModalProps {
  isOpen: boolean
  close: () => void
  screenReaderLabel?: string
}

export default function Modal({
  isOpen,
  screenReaderLabel,
  close,
  children,
}: PropsWithChildren<ModalProps>) {
  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="fixed bg-gray-100 bg-opacity-75 inset-0"
      contentLabel={screenReaderLabel}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end">
          <span className="cursor-pointer" onClick={close}>
            <Image src={Close} alt="Close button" width={18} height={18} />
          </span>
        </div>
        { children }
      </div>
    </ReactModal>
  );
}
