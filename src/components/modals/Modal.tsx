import Image from 'next/image';
import { CSSProperties, PropsWithChildren, ReactElement } from 'react';
import ReactModal from 'react-modal';
import Close from 'src/images/icons/close.svg';

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  screenReaderLabel?: string;
  contentStyle?: CSSProperties;
  header?: ReactElement | string;
}

export const Modal = ({
  isOpen,
  screenReaderLabel,
  close,
  children,
  contentStyle,
  header,
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
          padding: '25px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <div className="flex flex-col h-full">
        <div className={`flex ${header ? 'justify-between' : 'justify-end'}`}>
          {header || null}
          <span className="cursor-pointer" onClick={close}>
            <Image src={Close} alt="Close button" width={24} height={24} />
          </span>
        </div>
        {children}
      </div>
    </ReactModal>
  );
};
