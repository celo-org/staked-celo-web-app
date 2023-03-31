import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Governance } from 'src/features/governance/components/Governance';
import { Swap } from 'src/features/swap/components/Swap';
import { Validators } from 'src/features/validators/components/Validators';
import { Mode } from 'src/types';
import * as ga from '../utils/ga';

const SwapPage: NextPage = () => {
  const router = useRouter();
  const {
    slug: [mode = Mode.stake],
  } = router.query as { slug: string[] };

  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
    const handleRouteChange = (url: URL) => {
      ga.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
  };
  if (typeof mode !== 'string' || !Object.values(Mode).includes(mode as Mode)) return null;
  switch (mode as Mode) {
    case Mode.governance:
      return <Governance onModeChange={onModeChange} />;
    case Mode.validators:
      return <Validators onModeChange={onModeChange} />;
    case Mode.stake:
    case Mode.unstake:
    default:
      return <Swap mode={mode as Mode} onModeChange={onModeChange} />;
  }
};

export default SwapPage;
