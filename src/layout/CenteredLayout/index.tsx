import { PropsWithChildren } from 'react';

interface CenteredLayoutProps {
  classes?: string;
}

export const CenteredLayout = ({
  children,
  classes = '',
}: PropsWithChildren<CenteredLayoutProps>) => {
  return <div className={`flex flex-col max-w-[480px] mx-auto w-full ${classes}`}>{children}</div>;
};
