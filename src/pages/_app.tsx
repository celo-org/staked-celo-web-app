import type { AppProps } from 'next/app'
import { AppLayout } from 'src/layout/AppLayout'
import 'src/styles/fonts.css'
import 'src/styles/globals.css'

export default function App({ Component, pageProps, router }: AppProps) {
  const pathName = router.pathname
  return (
    <AppLayout pathName={pathName}>
      <Component {...pageProps} />
    </AppLayout>
  )
}
