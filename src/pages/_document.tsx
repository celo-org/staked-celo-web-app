import Document, { Head, Html, Main, NextScript } from 'next/document';

const name = 'Liquid Staking';
const description = 'A simple DApp for Celo liquid staking.';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />

          <link rel="manifest" href="/site.webmanifest" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          <meta name="application-name" content={name} />
          <meta name="keywords" content={description} />
          <meta name="description" content={description} />
        </Head>
        <body className="bg-primary">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
