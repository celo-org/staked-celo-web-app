import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Details } from 'src/features/validators/components/Details';
import getGroupName from 'src/features/validators/data/getGroupName';
import {
  getChainIdFromQuery,
  useRedirectToConnectedChainIfNeeded,
} from 'src/hooks/useRedirectToConnectedChainIfNeeded';
import logger from 'src/services/logger';
import { Address } from 'viem';
import { isAddress } from 'web3-utils';

interface Props {
  name?: string;
  serverChainId: number;
}

interface Query extends ParsedUrlQuery {
  groupAddress: Address[];
}

const ValidatorGroupShowPage: NextPage<Props, Query> = ({ name, serverChainId }: Props) => {
  const router = useRouter();
  const { slug: groupAddress } = router.query;
  const address = Array.isArray(groupAddress) ? groupAddress[0] : groupAddress;
  useRedirectToConnectedChainIfNeeded(serverChainId, `/validators/${address}`);

  return <Details groupAddress={address! as Address} name={name} />;
};

export default ValidatorGroupShowPage;

// will refetch every 3 minutes (if requests come in)
const MAX_AGE_SECONDS = 180;
// will serve old data for up to x hour (if no requests come in)
const SERVE_STALE_WHILE_REVALIDATE_SECONDS = 60 * 60 * 2;

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({
  res,
  params,
  query,
}) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SERVE_STALE_WHILE_REVALIDATE_SECONDS}`
  );

  const groupAddress = params?.slug;
  const address = Array.isArray(groupAddress) ? groupAddress[0] : groupAddress;
  if (typeof address !== 'string' || !isAddress(address)) {
    return {
      notFound: true,
    };
  }
  const chainId = getChainIdFromQuery(query);

  // will throw if no validatorGroup with such address
  try {
    const name = await getGroupName(chainId, address as Address);

    return {
      props: {
        serverChainId: chainId,
        name,
      },
    };
  } catch (error) {
    logger.error('failed to fetch group', address, error);
    return {
      notFound: true,
    };
  }
};
