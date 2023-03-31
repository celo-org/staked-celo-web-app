import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Validators } from 'src/features/validators/components/Validators';
import { Mode } from 'src/types';
import * as ga from '../utils/ga';

const ValidatorsPage: NextPage = () => {
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
  return <Validators onModeChange={onModeChange} />;
};

export default ValidatorsPage;
