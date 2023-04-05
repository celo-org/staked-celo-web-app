import { ChainId, useCelo } from '@celo/react-celo';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useLayoutEffect, useMemo } from 'react';
import { Switcher } from 'src/components/switcher/Switcher';
import { Governance } from 'src/features/governance/components/Governance';
import { Swap } from 'src/features/swap/components/Swap';
import { Validators } from 'src/features/validators/components/Validators';
import fetchValidGroups, { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

interface Props {
  validatorGroups?: {
    chainId: number;
    groups: ValidatorGroup[];
  };
}

const MultiModePage: NextPage = (props: Props) => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string[] };
  const mode = slug ? slug[0] : Mode.stake;
  const validatorPageProps = props.validatorGroups;
  const chainValidatorSetIsFor = validatorPageProps?.chainId;

  useQueryStringForChain(chainValidatorSetIsFor, mode);

  const page = useMemo(() => {
    switch (mode) {
      case Mode.stake:
      case Mode.unstake:
        return <Swap mode={mode as Mode} />;
      case Mode.governance:
        return <Governance />;
      case Mode.validators:
        return <Validators list={validatorPageProps!.groups} key={chainValidatorSetIsFor} />;
      default:
        return null;
    }
  }, [mode, validatorPageProps, chainValidatorSetIsFor]);

  if (!page) return page;

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={mode as Mode} />
      {page}
    </CenteredLayout>
  );
};

export default MultiModePage;

const MAX_AGE_SECONDS = 60 * 15;
const SWR_SECONDS = 60 * 60 * 12;

export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({
  query,
  res,
  params,
}) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SWR_SECONDS}`
  );

  const slug = Array.isArray(params?.slug) ? params?.slug[0] : params?.slug;

  switch (slug) {
    case Mode.validators: {
      const chainId = Array.isArray(query.chainId)
        ? Number(query.chainId[0])
        : Number(query.chainId) ?? ChainId.Mainnet;
      const groups = await fetchValidGroups(chainId);

      return {
        props: {
          validatorGroups: groups,
        },
      };
    }
    case Mode.governance:
    case Mode.stake:
    case Mode.unstake:
      return {
        props: {},
      };
    default: {
      return {
        notFound: true,
      };
    }
  }
};

function useQueryStringForChain(chainValidatorSetIsFor: ChainId | undefined, mode: MOde) {
  const router = useRouter();
  const { network } = useCelo();
  useLayoutEffect(() => {
    if (network.chainId !== chainValidatorSetIsFor) {
      void router.push({
        pathname: mode,
        query: network.chainId === ChainId.Mainnet ? {} : { chainId: network.chainId },
      });
    }
  }, [chainValidatorSetIsFor, network, router, mode]);
}
