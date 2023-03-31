import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Governance } from 'src/features/governance/components/Governance';
import { Mode } from 'src/types';

const GovernancePage: NextPage = () => {
  const router = useRouter();
  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
  };
  return <Governance onModeChange={onModeChange} />;
};

export default GovernancePage;
