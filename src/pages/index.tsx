import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Swap } from 'src/features/swap/components/Swap';
import { Mode } from 'src/types';
import * as ga from '../utils/ga';

const SwapPage: NextPage = () => {
  const router = useRouter();
  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
    const handleRouteChange = (url: URL) => {
      ga.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
  };

  return <Swap mode={Mode.stake} onModeChange={onModeChange} />;
};

export default SwapPage;
