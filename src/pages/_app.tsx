import type { AppProps } from 'next/app';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import { ClientOnly } from 'src/components/ClientOnly';
import { AppLayout } from 'src/layout/AppLayout';
import { CeloProvider } from 'src/providers/CeloProvider';
import 'src/styles/fonts.css';
import 'src/styles/globals.css';

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname;
  return (
    <CeloProvider>
      <ClientOnly>
        <AppLayout pathName={pathName}>
          <Component {...pageProps} />
          <ToastContainer transition={Zoom} position={toast.POSITION.TOP_RIGHT} />
        </AppLayout>
      </ClientOnly>
    </CeloProvider>
  );
}
