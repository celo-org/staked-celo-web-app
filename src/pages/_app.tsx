import type { AppProps } from 'next/app';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClientOnly } from 'src/components/ClientOnly';
import { AppLayout } from 'src/layout/AppLayout';
import { AccountProvider } from 'src/providers/AccountProvider';
import { CeloProvider } from 'src/providers/CeloProvider';
import 'src/styles/fonts.css';
import 'src/styles/globals.css';

const App = ({ Component, pageProps, router }: AppProps) => {
  const pathName = router.pathname;

  return (
    <ClientOnly>
      <CeloProvider>
        <AccountProvider>
          <AppLayout pathName={pathName}>
            <Component {...pageProps} />
            <ToastContainer transition={Zoom} position={toast.POSITION.TOP_RIGHT} />
          </AppLayout>
        </AccountProvider>
      </CeloProvider>
    </ClientOnly>
  );
};

export default App;
