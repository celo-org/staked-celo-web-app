import { PropsWithChildren } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  screenReaderLabel?: string;
}

export const Modal = ({
  isOpen,
  screenReaderLabel,
  close,
  children,
}: PropsWithChildren<ModalProps>) => {
  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="fixed inset-0"
      contentLabel={screenReaderLabel}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      style={{
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        content: {
          position: 'static',
          display: 'inline-block',
          borderRadius: '8px',
          padding: '0',
          border: 'none',
          maxWidth: '520px',
          width: '100%',
          background: 'none',
        },
      }}
    >
      {children}
    </ReactModal>
  );
};
