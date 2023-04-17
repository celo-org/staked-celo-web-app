import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Switcher } from 'src/components/switcher/Switcher';
import { Governance } from 'src/features/governance/components/Governance';
import { Swap } from 'src/features/swap/components/Swap';
import { Validators } from 'src/features/validators/components/List';
import fetchValidGroups, { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups';
import { useIsTransitioning } from 'src/hooks/useIsTransitioning';
import {
  getChainIdFromQuery,
  useRedirectToConnectedChainIfNeeded,
} from 'src/hooks/useRedirectToConnectedChainIfNeeded';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

interface Props {
  serverSideChainId: number;
  validatorGroups?: ValidatorGroup[];
}

const MultiModePage: NextPage<Props> = ({ serverSideChainId, validatorGroups }) => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string[] };
  const mode = (slug ? slug[0] : Mode.stake) as Mode;

  useRedirectToConnectedChainIfNeeded(serverSideChainId, mode);
  const isTransitioning = useIsTransitioning();

  const page = useMemo(() => {
    switch (mode) {
      case Mode.stake:
      case Mode.unstake:
        return <Swap mode={mode as Mode} />;
      case Mode.governance:
        return <Governance />;
      case Mode.validators:
        return <Validators list={validatorGroups || []} key={serverSideChainId} />;
      default:
        return null;
    }
  }, [mode, validatorGroups, serverSideChainId]);

  if (!page) return page;

  return (
    <CenteredLayout classes={`px-[24px] ${isTransitioning && 'animate-pulse'}`}>
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
  const chainId = getChainIdFromQuery(query);

  switch (slug) {
    case Mode.validators: {
      const groups = await fetchValidGroups(chainId);

      return {
        props: {
          serverSideChainId: chainId,
          validatorGroups: groups.groups,
        },
      };
    }
    case Mode.governance:
    case Mode.stake:
    case Mode.unstake:
      return {
        props: { serverSideChainId: chainId },
      };
    default: {
      return {
        notFound: true,
      };
    }
  }
};
