// components/PageWithTransition.tsx
import { useRouter } from 'next/router';
import { useLayoutEffect, useState } from 'react';

export function useIsTransitioning() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  useLayoutEffect(() => {
    const begin = () => {
      setTransitioning(true);
    };
    const end = () => {
      setTransitioning(false);
    };
    router.events.on('routeChangeStart', begin);
    router.events.on('routeChangeError', end);
    router.events.on('routeChangeComplete', end);
    return () => {
      router.events.off('routeChangeStart', begin);
      router.events.off('routeChangeError', end);
      router.events.off('routeChangeComplete', end);
    };
  }, [router.events, router.asPath]);

  return transitioning;
}
