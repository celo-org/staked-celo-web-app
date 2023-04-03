import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Show } from 'src/features/validators/components/Show';
import getGroupName from 'src/features/validators/data/getGroupName';

interface Props {
  name?: string;
}

const ValidatorGroupShowPage: NextPage = ({ name }: Props) => {
  const router = useRouter();
  const {
    slug: [address],
  } = router.query as { slug: string[] };
  return <Show address={address} name={name} />;
};

export default ValidatorGroupShowPage;

// will refetch every 3 minutes (if requests come in)
const MAX_AGE_SECONDS = 180;
// will serve old data for up to x hour (if no requests come in)
const SERVE_STALE_WHILE_REVALIDATE_SECONDS = 60 * 60 * 2 ;

export const getServerSideProps: GetServerSideProps<Props> = async ({ res, params }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SERVE_STALE_WHILE_REVALIDATE_SECONDS}`
  );

  const typedParams = params as { slug: string[] | string };

  const address = Array.isArray(typedParams.slug) ? typedParams.slug[0] : typedParams.slug

  if (typeof address !== 'string' || !address.startsWith('0x')) {
    return {
      notFound: true,
    };
  }

  // will throw if no validatorGroup with such address
  try {
    const name = await getGroupName(address);

    return {
      props: {
        name,
      },
    };

  } catch (error) {
    return {
      notFound: true
    }
  }
};
