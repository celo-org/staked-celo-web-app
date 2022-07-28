import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClientOnly } from 'src/components/ClientOnly';
import { AppLayout } from 'src/layout/AppLayout';
import { useAccountContext } from 'src/providers/AccountProvider';
import { TopProvider } from 'src/providers/TopProvider';
import 'src/styles/fonts.css';
import 'src/styles/globals.css';

dayjs.extend(relativeTime);

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

const App = ({ Component, pageProps, router }: AppProps) => {
  const pathName = router.pathname;

  return (
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
  );
};

export default App;
