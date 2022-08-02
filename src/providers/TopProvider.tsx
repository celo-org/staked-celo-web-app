import { PropsWithChildren } from 'react';
import { AccountProvider } from 'src/contexts/account/AccountContext';
import { ExchangeProvider } from 'src/contexts/exchange/ExchangeContext';
import { ThemeProvider } from 'src/contexts/theme/ThemeContext';
import { CeloProvider } from './CeloProvider';

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
