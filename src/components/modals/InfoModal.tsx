import { PropsWithChildren } from 'react';
import { Modal } from './Modal';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  title: string;
}

export const InfoModal = ({ isOpen, close, children, title }: PropsWithChildren<ModalProps>) => {
  return (
    <Modal isOpen={isOpen} screenReaderLabel={title} close={close}>
      <div className="flex flex-col h-full w-96 text-modal">
        <div className="flex justify-between text-2xl mb-4 mt-2">{title}</div>
        <div className="font-light mb-4">{children}</div>
        <div className="cursor-pointer p-4 text-xl text-purple text-center" onClick={close}>
          Dismiss
        </div>
      </div>
    </Modal>
  );
};
