import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { Footer } from './partials/Footer';
import { Header } from './partials/Header';

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function getHeadTitle(pathName: string) {
  const segments = pathName.split('/');
  if (segments.length <= 1 || !segments[1]) return 'Home';
  else return toTitleCase(segments[1]);
}

interface Props {
  pathName: string;
}

export const AppLayout = ({ pathName, children }: PropsWithChildren<Props>) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Liquid Staking | ${getHeadTitle(pathName)}`}</title>
      </Head>
      <div className="flex flex-col h-full min-h-screen w-full min-w-screen">
        <Header />
        <main className="w-full flex-1 flex">{children}</main>
        <Footer />
      </div>
    </>
  );
};
