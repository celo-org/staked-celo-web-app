import { PropsWithChildren } from 'react';

interface CenteredLayoutProps {
  classes?: string;
}

export const CenteredLayout = ({
  children,
  classes = '',
}: PropsWithChildren<CenteredLayoutProps>) => {
  return (
    <div
      className={`flex flex-col sm:pt-[40px] pt-[16px] sm:pb-[120px] pb-[80px] max-w-[480px] mx-auto w-full ${classes}`}
    >
      {children}
    </div>
  );
};
