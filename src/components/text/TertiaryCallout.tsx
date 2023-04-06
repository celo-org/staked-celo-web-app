import { PropsWithChildren } from 'react';

interface LabelProps {
  classes?: string;
}

export const TertiaryCallout = ({ children, classes = '' }: PropsWithChildren<LabelProps>) => {
  return (
    <span className={`text-[16px] mb-2 w-full text-color-tertiary-callout ${classes}`}>
      {children}
    </span>
  );
};
