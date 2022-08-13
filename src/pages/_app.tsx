import { CeloProvider as ReactCeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AccountProvider, useAccountContext } from 'src/contexts/account/AccountContext';
import { ProtocolProvider } from 'src/contexts/protocol/ProtocolContext';
import { ThemeProvider } from 'src/contexts/theme/ThemeContext';
import { AppLayout } from 'src/layout/AppLayout';
import 'src/styles/globals.css';
import 'src/styles/transitions.scss';

dayjs.extend(relativeTime);

const App = ({ Component, pageProps, router }: AppProps) => {
  const pathName = router.pathname;

  return (
    <>
      <Head>
        <title>{`StakedCelo - Liquid staking on Celo | ${getHeadTitle(pathName)}`}</title>
      </Head>
      <ClientOnly>
        <TopProvider>
          <CeloConnectRedirect>
            <AppLayout pathName={pathName}>
              <Component {...pageProps} />
              <ToastContainer transition={Zoom} position={toast.POSITION.TOP_CENTER} icon={false} />
            </AppLayout>
          </CeloConnectRedirect>
        </TopProvider>
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
  return (
    <CeloProvider>
      <ThemeProvider>
        <ProtocolProvider>
          <AccountProvider>{props.children}</AccountProvider>
        </ProtocolProvider>
      </ThemeProvider>
    </CeloProvider>
  );
};

const CeloProvider = (props: PropsWithChildren) => {
  return (
    <ReactCeloProvider
      dapp={{
        icon: '/logo.svg',
        name: 'Celo Staking',
        description: 'Celo staking application',
        url: '',
      }}
      connectModal={{
        title: <span>Connect Wallet</span>,
        providersOptions: {
          searchable: false,
        },
      }}
    >
      {props.children}
    </ReactCeloProvider>
  );
};

const routingsWithoutConnection = ['/connect', '/faq'];
const CeloConnectRedirect = (props: PropsWithChildren) => {
  const router = useRouter();
  const { isConnected } = useAccountContext();

  if (!isConnected && !routingsWithoutConnection.includes(router.pathname)) {
    void router.push('/connect');

    // Router is async. Show empty screen before redirect.
    return null;
  } else if (isConnected && router.pathname == '/connect') {
    void router.push('/');

    return null;
  }

  return <>{props.children}</>;
};

export default App;
