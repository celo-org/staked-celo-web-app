import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Governance } from 'src/features/governance/components/Governance';
import { Mode } from 'src/types';
import * as ga from '../utils/ga';

const GovernancePage: NextPage = () => {
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
  return <Governance onModeChange={onModeChange} />;
};

export default GovernancePage;
