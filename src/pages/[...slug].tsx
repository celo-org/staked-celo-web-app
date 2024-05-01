import { get as getGeoFromIP } from 'geoip2-api';
import type { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import { useLayoutEffect, useMemo } from 'react';
import { Switcher } from 'src/components/switcher/Switcher';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { Governance } from 'src/features/governance/components/Governance';
import { SerializedProposal, getProposals } from 'src/features/governance/data/getProposals';
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
  proposals?: SerializedProposal[];
  pastProposals?: SerializedProposal[];
}

const MultiModePage: NextPage<Props> = ({
  serverSideChainId,
  validatorGroups,
  proposals,
  pastProposals,
}) => {
  const { slug } = Router.query as { slug?: string[] };
  const mode = (slug ? slug[0] : Mode.stake) as Mode;

  useRedirectToConnectedChainIfNeeded(serverSideChainId, mode);
  const isTransitioning = useIsTransitioning();
  const { isConnected } = useAccountContext();

  useLayoutEffect(() => {
    if (isTransitioning) return;

    if (!isConnected && [Mode.stake, Mode.unstake].includes(mode)) {
      void Router.replace('/connect');
    }
  }, [isTransitioning, mode, isConnected]);

  const page = useMemo(() => {
    switch (mode) {
      case Mode.stake:
      case Mode.unstake:
        return <Swap mode={mode as Mode} />;
      case Mode.governance:
        return <Governance proposals={proposals!} pastProposals={pastProposals!} />;
      case Mode.validators:
        return <Validators list={validatorGroups || []} key={serverSideChainId} />;
      default:
        return null;
    }
  }, [mode, validatorGroups, serverSideChainId, proposals, pastProposals]);

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
  req,
  params,
}) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${MAX_AGE_SECONDS}, stale-while-revalidate=${SWR_SECONDS}`
  );
  console.log('headers', req.headers);
  // @ts-expect-error
  const country = req['x-vercel-ip-country'];
  // @ts-expect-error
  const city = req['x-vercel-ip-city'];

  console.info('counry', country, 'city', city);

  const ipAddress = req.headers['x-forwarded-for'] as string;

  const locationData = await getGeoFromIP(ipAddress);
  console.log('geolocation', locationData);

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
    case Mode.governance: {
      const proposals = await getProposals(chainId);
      return {
        props: {
          serverSideChainId: chainId,
          proposals: proposals.proposals,
          pastProposals: proposals.pastProposals,
        },
      };
    }
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
