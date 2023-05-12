import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useLayoutEffect } from 'react';
import { useChainId } from 'wagmi';
import { celo } from 'wagmi/chains';

// only use on page components
export function useRedirectToConnectedChainIfNeeded(
  chainServerKnowsAbout: number | undefined,
  path: string
) {
  const router = useRouter();
  const chainId = useChainId();
  useLayoutEffect(() => {
    const serverSideChainId = chainServerKnowsAbout ?? router.query.chainId ?? celo.id;
    if (chainId !== serverSideChainId) {
      void router.push({
        pathname: path,
        query: chainId === celo.id ? {} : { chainId },
      });
    }
  }, [chainServerKnowsAbout, router, path, chainId]);
}

export function getChainIdFromQuery(query: ParsedUrlQuery) {
  return (
    (Array.isArray(query.chainId) ? Number(query.chainId[0]) : Number(query.chainId)) || celo.id
  );
}
