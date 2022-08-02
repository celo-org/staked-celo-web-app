import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { AppLayout } from 'src/layout/AppLayout';
import { TopProvider } from 'src/providers/TopProvider';
import 'src/styles/globals.css';

dayjs.extend(relativeTime);

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

// https://github.com/vercel/next.js/issues/2473#issuecomment-587551234
const ClientOnly = ({ children }: PropsWithChildren) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
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
