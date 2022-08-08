import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { useThemeContext } from 'src/contexts/theme/ThemeContext';
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
  const { theme } = useThemeContext();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* colors are the same as --c-bg-primary-color in styles/globals */}
        <meta name="theme-color" content={theme === 'dark' ? '#212B2E' : '#FFFDF4'} />
        <title>{`Liquid Staking | ${getHeadTitle(pathName)}`}</title>
      </Head>
      <div className="flex flex-col h-full min-w-screen min-w-[320px] sm:min-h-screen text-color-primary overflow-x-hidden">
        <div className="flex flex-col min-h-screen sm:min-h-full sm:flex-grow">
          <Header />
          <main className="flex sm:flex-grow sm:justify-center">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
};
