import { PropsWithChildren, useEffect, useState } from 'react';

// https://github.com/vercel/next.js/issues/2473#issuecomment-587551234
export const ClientOnly = ({ children }: PropsWithChildren) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};
