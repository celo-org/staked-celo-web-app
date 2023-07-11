// components/PageWithTransition.tsx
import Router from 'next/router';
import { useLayoutEffect, useState } from 'react';

export function useIsTransitioning() {
  const [transitioning, setTransitioning] = useState(false);
  useLayoutEffect(() => {
    const begin = () => {
      setTransitioning(true);
    };
    const end = () => {
      setTransitioning(false);
    };
    Router.events.on('routeChangeStart', begin);
    Router.events.on('routeChangeError', end);
    Router.events.on('routeChangeComplete', end);
    return () => {
      Router.events.off('routeChangeStart', begin);
      Router.events.off('routeChangeError', end);
      Router.events.off('routeChangeComplete', end);
    };
  }, [Router.asPath]);

  return transitioning;
}
