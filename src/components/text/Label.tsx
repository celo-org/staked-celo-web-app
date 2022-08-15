import { PropsWithChildren } from 'react';

interface LabelProps {
  classes?: string;
}

export const Label = ({ children, classes = '' }: PropsWithChildren<LabelProps>) => {
  return <span className={`text-[14px] leading-[16px] font-medium ${classes}`}>{children}</span>;
};
