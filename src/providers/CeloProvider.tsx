import { CeloProvider as ReactCeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import { PropsWithChildren } from 'react';
import { networkConfig } from 'src/config/celo';
import { AccountProvider } from './AccountProvider';
import { ExchangeProvider } from './ExchangeProvider';
import { ThemeProvider } from './ThemeProvider';

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
      <ThemeProvider>
        <AccountProvider>
          <ExchangeProvider>{props.children}</ExchangeProvider>
        </AccountProvider>
      </ThemeProvider>
    </ReactCeloProvider>
  );
};
