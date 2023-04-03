import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Validators } from 'src/features/validators/components/List';
import { Mode } from 'src/types';

const ValidatorsPage: NextPage = () => {
  const router = useRouter();
  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
  };
  return <Validators onModeChange={onModeChange} />;
};

export default ValidatorsPage;
