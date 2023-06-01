import { Celo } from '@celo/rainbowkit-celo/chains';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useLayoutEffect } from 'react';
import { Option } from 'src/types';
import { useChainId } from 'wagmi';

// only use on page components
export function useRedirectToConnectedChainIfNeeded(
  chainServerKnowsAbout: Option<number>,
  path: string
) {
  const router = useRouter();
  const chainId = useChainId();
  useLayoutEffect(() => {
    const serverSideChainId = chainServerKnowsAbout ?? router.query.chainId ?? Celo.id;
    if (chainId !== serverSideChainId) {
      void router.push({
        pathname: path,
        query: chainId === Celo.id ? {} : { chainId },
      });
    }
  }, [chainServerKnowsAbout, router, path, chainId]);
}

export function getChainIdFromQuery(query: ParsedUrlQuery) {
  return (
    (Array.isArray(query.chainId) ? Number(query.chainId[0]) : Number(query.chainId)) || Celo.id
  );
}
