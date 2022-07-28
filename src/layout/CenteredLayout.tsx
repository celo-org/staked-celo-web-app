import { PropsWithChildren } from 'react';

export const CenteredLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-col md:w-96 mx-auto w-full px-4 mb-14">{children}</div>;
};
