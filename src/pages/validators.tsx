import { ChainId, useCelo } from '@celo/react-celo';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';
import { Validators } from 'src/features/validators/components/Validators';
import fetchValidGroups, { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups';
import { Mode } from 'src/types';

interface Props {
  validatorGroups: {
    chainId: number;
    groups: ValidatorGroup[];
  };
}

const ValidatorsPage: NextPage<Props> = (props) => {
  const router = useRouter();
  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
  };
  const { network } = useCelo();

  const chainValidatorSetIsFor = props.validatorGroups.chainId;

  useLayoutEffect(() => {
    if (network.chainId !== chainValidatorSetIsFor) {
      void router.push(
        network.chainId === ChainId.Mainnet
          ? `/validators`
          : `/validators?chainId=${network.chainId}`
      );
    }
  }, [chainValidatorSetIsFor, network, router]);

  return <Validators list={props.validatorGroups.groups} />;
};

export default ValidatorsPage;

const MAX_AGE_SECONDS = 60 * 10;
const SWR_SECONDS = 60 * 60 * 12;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SWR_SECONDS}`
  );
  const chainId = Array.isArray(query.chainId)
    ? Number(query.chainId[0])
    : Number(query.chainId) ?? ChainId.Mainnet;
  const data = await fetchValidGroups(chainId);

  return {
    props: {
      chainId,
      validatorGroups: data,
    },
  };
};
