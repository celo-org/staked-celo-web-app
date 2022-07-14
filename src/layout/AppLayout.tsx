import Head from 'next/head';
import { PropsWithChildren } from 'react';
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

export function AppLayout({ pathName, children }: PropsWithChildren<Props>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Liquid Staking | ${getHeadTitle(pathName)}`}</title>
      </Head>
      <div
        className={`flex flex-col justify-between h-full min-h-screen w-full min-w-screen bg-gradient-radial`}
      >
        <Header pathName={pathName} />
        <main className="w-full">{children}</main>
        <footer className="w-screen py-4 px-7">Empty footer</footer>
      </div>
    </>
  );
}
