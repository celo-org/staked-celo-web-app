import { PropsWithChildren } from 'react';
import { CenteredLayout } from 'src/layout/CenteredLayout';

interface TextLayoutProps {
  header: string;
}

export const TextLayout = ({ header, children }: PropsWithChildren<TextLayoutProps>) => {
  return (
    <CenteredLayout classes="px-base">
      <div className="font-medium text-[32px] leading-[40px] mb-[32px]">{header}</div>
      {children}
    </CenteredLayout>
  );
};
