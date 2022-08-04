import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

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
      <div className="flex flex-col h-full w-full min-w-screen md:min-h-screen">
        <div className="min-h-screen md:min-h-full md:flex-grow">
          <Header />
          <main className="w-full flex-1 flex">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
};
