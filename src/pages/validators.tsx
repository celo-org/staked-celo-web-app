import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Validators } from 'src/features/validators/components/Validators';
import fetchValidGroups, { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups';
import { Mode } from 'src/types';

interface Props {
  validatorGroups: ValidatorGroup[];
}

const ValidatorsPage: NextPage<Props> = (props) => {
  const router = useRouter();
  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
  };

  return <Validators onModeChange={onModeChange} list={props.validatorGroups} />;
};

export default ValidatorsPage;

const MAX_AGE_SECONDS = 60 * 10;
const SWR_SECONDS = 60 * 60 * 12;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SWR_SECONDS}`
  );

  const validatorGroups = await fetchValidGroups();

  return {
    props: {
      validatorGroups,
    },
  };
};
