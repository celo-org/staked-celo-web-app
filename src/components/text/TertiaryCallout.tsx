import { PropsWithChildren } from 'react';

interface LabelProps {
  classes?: string;
}

export const TertiaryCallout = ({ children, classes = '' }: PropsWithChildren<LabelProps>) => {
  return <span className={`text-[16px] text-color-tertiary-callout ${classes}`}>{children}</span>;
};
