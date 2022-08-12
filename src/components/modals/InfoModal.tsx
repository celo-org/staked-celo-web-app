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
      <div className="flex flex-col bg-white text-color-modal p-[24px]">
        <div className="flex justify-between text-[20px] leading-[24px] mb-[16px]">{title}</div>
        <div className="font-light mb-[24px] text-[16px] leading-[24px]">{children}</div>
        <div
          className="cursor-pointer py-[8px] text-[18px] leading-[24px] text-color-purple text-center"
          onClick={close}
        >
          Dismiss
        </div>
      </div>
    </Modal>
  );
};
