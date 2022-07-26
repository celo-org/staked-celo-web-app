import { CeloProvider as ReactCeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { networkConfig } from 'src/config/celo';
import { AccountProvider, useAccountContext } from './AccountProvider';
import { ExchangeProvider } from './ExchangeProvider';

export const CeloProvider = (props: PropsWithChildren) => {
  return (
    <ReactCeloProvider
      dapp={{
        icon: '/logo.svg',
        name: 'Celo Staking',
        description: 'Celo staking application',
        url: '',
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
  const { isConnected } = useAccountContext();

  if (!isConnected && router.pathname !== '/connect') {
    void router.push('/connect');

    // Router is async. Show empty screen before redirect.
    return null;
  } else if (isConnected && router.pathname == '/connect') {
    void router.push('/');

    return null;
  }

  return <>{props.children}</>;
};
