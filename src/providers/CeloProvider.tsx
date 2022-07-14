import { CeloProvider as ReactCeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import { PropsWithChildren } from 'react';
import { networkConfig } from 'src/config/celo';

export function CeloProvider(props: PropsWithChildren) {
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
      {props.children}
    </ReactCeloProvider>
  );
}
