import Document, { Head, Html, Main, NextScript } from 'next/document'

const name = 'Liquid Staking'
const description = 'A simple DApp for Celo liquid staking.'
const url = ''

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#35d07f" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />

          <meta name="application-name" content={name} />
          <meta name="keywords" content={description} />
          <meta name="description" content={description} />

          <meta name="HandheldFriendly" content="true" />
          <meta name="apple-mobile-web-app-title" content={name} />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta property="og:url" content={url} />
          <meta property="og:title" content={name} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`${url}/celo-hero.jpg`} />
          <meta property="og:description" content={description} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={name} />
          <meta name="twitter:description" content="" />
          <meta name="twitter:image" content={`${url}/celo-hero.jpg`} />
        </Head>
        <body className="text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
