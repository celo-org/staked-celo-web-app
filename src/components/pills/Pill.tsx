import { PropsWithChildren } from 'react';

interface LabelProps {
  classes?: string;
}

export const Pill = ({ children, classes = '' }: PropsWithChildren<LabelProps>) => {
  return (
    <span className={`rounded-lg px-2 py-1 text-[12px] leading-[14px] font-medium ${classes}`}>
      {children}
    </span>
  );
};
