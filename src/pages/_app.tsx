import type { AppProps } from 'next/app'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppLayout } from 'src/layout/AppLayout'
import 'src/styles/fonts.css'
import 'src/styles/globals.css'

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname
  return (
    <AppLayout pathName={pathName}>
      <Component {...pageProps} />
      <ToastContainer transition={Zoom} position={toast.POSITION.TOP_RIGHT} />
    </AppLayout>
  )
}
