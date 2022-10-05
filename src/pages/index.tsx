import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Swap } from 'src/features/swap/components/Swap';
import { Mode } from 'src/features/swap/types';
import * as ga from '../utils/ga';

const SwapPage: NextPage = () => {
  const router = useRouter();
  const { mode = 'stake' } = router.query;
  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: router.pathname,
      query: { mode },
    });
    const handleRouteChange = (url: URL) => {
      ga.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
  };
  if (typeof mode !== 'string' || !['stake', 'unstake'].includes(mode)) return null;
  return <Swap mode={mode as Mode} onModeChange={onModeChange} />;
};

export default SwapPage;
