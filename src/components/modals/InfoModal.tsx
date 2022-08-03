import { PropsWithChildren } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  title: string;
}

export const InfoModal = ({ isOpen, close, children, title }: PropsWithChildren<ModalProps>) => {
  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="fixed bg-gray-100 bg-opacity-75 inset-0"
      contentLabel={title}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        content: {
          display: 'inline-block',
          inset: '50% auto auto 50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <div className="flex flex-col h-full w-96 text-modal">
        <div className="flex justify-between text-2xl mb-4 mt-2">{title}</div>
        <div className="font-light mb-4">{children}</div>
        <div className="cursor-pointer p-4 text-xl text-purple text-center" onClick={close}>
          Dismiss
        </div>
      </div>
    </ReactModal>
  );
};
