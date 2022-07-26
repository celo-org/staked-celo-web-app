import { PropsWithChildren } from 'react';
import { AccountProvider } from './AccountProvider';
import { CeloProvider } from './CeloProvider';
import { ExchangeProvider } from './ExchangeProvider';
import { ThemeProvider } from './ThemeProvider';

export const TopProvider = (props: PropsWithChildren) => {
  return (
    <CeloProvider>
      <ThemeProvider>
        <AccountProvider>
          <ExchangeProvider>{props.children}</ExchangeProvider>
        </AccountProvider>
      </ThemeProvider>
    </CeloProvider>
  );
};
