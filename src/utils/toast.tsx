import { ReactElement } from 'react';
import { toast as reactToast } from 'react-toastify';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';

// react-toastify default styles are overridden in styles/toasts.css
type ToastTypes = 'default' | 'error' | 'warning' | 'info' | 'success';

export const showToast = (
  icon: ReactElement,
  content: ReactElement,
  type?: ToastTypes,
  duration?: number
) =>
  reactToast(content, {
    icon,
    type: type || 'success',
    theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
    closeButton: <ThemedIcon name="close" alt="Close" width={32} height={32} />,
    autoClose: duration,
  });
