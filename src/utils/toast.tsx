import { ReactElement } from 'react';
import { toast as reactToast } from 'react-toastify';

export const showToast = (icon: ReactElement, content: ReactElement) =>
  reactToast.success(content, { icon });
