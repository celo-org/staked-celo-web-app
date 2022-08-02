import { CSSProperties, PropsWithChildren } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  screenReaderLabel?: string;
  contentStyle?: CSSProperties;
}

export const Modal = ({
  isOpen,
  screenReaderLabel,
  close,
  children,
  contentStyle,
}: PropsWithChildren<ModalProps>) => {
  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="fixed bg-gray-100 bg-opacity-75 inset-0"
      contentLabel={screenReaderLabel}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        content: {
          ...contentStyle,
          display: 'inline-block',
          inset: '50% auto auto 50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      {children}
    </ReactModal>
  );
};
