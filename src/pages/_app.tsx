import '@rainbow-me/rainbowkit/styles.css';

import {
  braveWallet,
  injectedWallet,
  rabbyWallet,
  safeWallet,
  valoraWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AccountProvider } from 'src/contexts/account/AccountContext';
import { BlockchainProvider } from 'src/contexts/blockchain/BlockchainContext';
import { ProtocolProvider } from 'src/contexts/protocol/ProtocolContext';
import { ThemeProvider, useThemeContext } from 'src/contexts/theme/ThemeContext';
import { AppLayout } from 'src/layout/AppLayout';
import 'src/styles/globals.css';
import 'src/styles/transitions.scss';
import { pageview } from '../utils/ga';

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WagmiProvider, http } from 'wagmi';

import { celo } from 'wagmi/chains';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'Staked Celo',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [celo],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [safeWallet, rabbyWallet, valoraWallet, braveWallet],
    },
    {
      groupName: 'Fallbacks',
      wallets: [walletConnectWallet, injectedWallet],
    },
  ],
  transports: {
    [celo.id]: http(),
  },
});

dayjs.extend(relativeTime);

const App = ({ Component, pageProps, router }: AppProps) => {
  const pathName = router.pathname;
  const { theme } = useThemeContext();

  return (
    <>
      <Head>
        <title>{`StakedCelo - Liquid staking on Celo | ${getHeadTitle(pathName)}`}</title>
      </Head>
      <ClientOnly>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={
                theme === 'dark'
                  ? darkTheme({
                      accentColor: '#9477F5',
                    })
                  : lightTheme({ accentColor: '#6F61D7' })
              }
            >
              <TopProvider>
                <CeloConnectRedirect>
                  <AppLayout pathName={pathName}>
                    <Component {...pageProps} />
                    <ToastContainer transition={Zoom} position={'top-right'} icon={false} />
                  </AppLayout>
                </CeloConnectRedirect>
              </TopProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
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
    <ThemeProvider>
      <BlockchainProvider>
        <ProtocolProvider>
          <AccountProvider>{props.children}</AccountProvider>
        </ProtocolProvider>
      </BlockchainProvider>
    </ThemeProvider>
  );
};

const CeloConnectRedirect = (props: PropsWithChildren) => {
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      pageview(url);
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
  }, []);

  return <>{props.children}</>;
};

export default App;
