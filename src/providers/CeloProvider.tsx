import { CeloProvider as ReactCeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { networkConfig } from 'src/config/celo';
import { useAccount } from 'src/hooks/useAccount';
import { AccountProvider } from './AccountProvider';
import { ExchangeProvider } from './ExchangeProvider';

export const CeloProvider = (props: PropsWithChildren) => {
  return (
    <ReactCeloProvider
      dapp={{
        icon: '/logo.svg',
        name: 'Celo Staking',
        description: 'Celo staking application',
        url: process.env.NEXT_PUBLIC_APP_URL as string,
      }}
      network={networkConfig}
      connectModal={{
        title: <span>Connect Wallet</span>,
        providersOptions: {
          searchable: false,
        },
      }}
    >
      <AccountProvider>
        <ExchangeProvider>
          <CeloConnectRedirect>{props.children}</CeloConnectRedirect>
        </ExchangeProvider>
      </AccountProvider>
    </ReactCeloProvider>
  );
};

const CeloConnectRedirect = (props: PropsWithChildren) => {
  const router = useRouter();
  const { isConnected } = useAccount();

  if (!isConnected && router.pathname !== '/connect') {
    void router.push('/connect');

    // Router is async. Shows empty screen before redirect.
    return null;
  }

  return <>{props.children}</>;
};
