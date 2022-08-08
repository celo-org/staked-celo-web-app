import Image from 'next/image';
import { ReactElement } from 'react';
import { toast as reactToast } from 'react-toastify';
import CloseIcon from 'src/images/icons/close.svg';

// react-toastify default styles are overridden in styles/toasts.css

export const showToast = (icon: ReactElement, content: ReactElement) =>
  reactToast.success(content, {
    icon,
    closeButton: <Image alt="Close" width={32} height={32} src={CloseIcon} />,
  });
