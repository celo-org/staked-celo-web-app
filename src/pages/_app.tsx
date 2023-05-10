import { CeloProvider, useCelo } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AccountProvider, useAccountContext } from 'src/contexts/account/AccountContext';
import { BlockchainProvider } from 'src/contexts/blockchain/BlockchainContext';
import { ProtocolProvider } from 'src/contexts/protocol/ProtocolContext';
import { ThemeProvider } from 'src/contexts/theme/ThemeContext';
import { AppLayout } from 'src/layout/AppLayout';
import 'src/styles/globals.css';
import 'src/styles/transitions.scss';
import { pageview } from '../utils/ga';

dayjs.extend(relativeTime);

const App = ({ Component, pageProps, router }: AppProps) => {
  const pathName = router.pathname;

  return (
    <>
      <Head>
        <title>{`StakedCelo - Liquid staking on Celo | ${getHeadTitle(pathName)}`}</title>
      </Head>
      <ClientOnly>
        <CeloProvider
          dapp={{
            icon: '/logo.svg',
            name: 'StakedCelo',
            description: 'Celo staking application',
            url: '',
            walletConnectProjectId: '3bcdb6756cdd7179c359c03ae1e8aca2',
          }}
          connectModal={{
            title: <span>Connect Wallet</span>,
            providersOptions: { searchable: false },
          }}
        >
          <TopProvider>
            <CeloConnectRedirect>
              <AppLayout pathName={pathName}>
                <Component {...pageProps} />
                <ToastContainer
                  transition={Zoom}
                  position={toast.POSITION.TOP_CENTER}
                  icon={false}
                />
              </AppLayout>
            </CeloConnectRedirect>
          </TopProvider>
        </CeloProvider>
      </ClientOnly>
    </>
  );
};

function getHeadTitle(pathName: string) {
  const segments = pathName.split('/');
  if (segments.length <= 1 || !segments[1]) return 'Home';

  return segments[1].replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// https://github.com/vercel/next.js/issues/2473#issuecomment-587551234
const ClientOnly = ({ children }: PropsWithChildren) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

const TopProvider = (props: PropsWithChildren) => {
  const { initialised } = useCelo();
  if (!initialised) return null;

  return (
    <ThemeProvider>
      <BlockchainProvider>
        <ProtocolProvider>
          <AccountProvider>{props.children}</AccountProvider>
        </ProtocolProvider>
      </BlockchainProvider>
    </ThemeProvider>
  );
};

const routingsWithConnection = ['/', '/stake', '/unstake'];
const CeloConnectRedirect = (props: PropsWithChildren) => {
  const router = useRouter();
  const { isConnected } = useAccountContext();
  const route = router.asPath;
  const lastRoute = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!isConnected && routingsWithConnection.includes(route)) {
      void router.push('/connect');
    } else if (isConnected && router.asPath == '/connect') {
      void router.push(lastRoute.current ?? '/stake');
    } else if (isConnected && router.asPath === '/') {
      void router.push('/stake');
    }
  }, [isConnected, router, route, lastRoute]);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageview(url);
    };
    // Record last route
    router.events.on('beforeHistoryChange', () => {
      lastRoute.current = router.asPath;
    });
    router.events.on('routeChangeComplete', handleRouteChange);
  }, [router]);

  return <>{props.children}</>;
};

export default App;
