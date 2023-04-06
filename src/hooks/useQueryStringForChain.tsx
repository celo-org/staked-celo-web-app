import { ChainId, useCelo } from '@celo/react-celo';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useLayoutEffect } from 'react';

// only use on page components
export function useQueryStringForChain(chainServerKnowsAbout: ChainId | undefined, path: string) {
  const router = useRouter();
  const { network } = useCelo();
  useLayoutEffect(() => {
    const serverSideChainId = chainServerKnowsAbout ?? router.query.chainId ?? ChainId.Mainnet;
    if (network.chainId !== serverSideChainId) {
      void router.push({
        pathname: path,
        query: network.chainId === ChainId.Mainnet ? {} : { chainId: network.chainId },
      });
    }
  }, [chainServerKnowsAbout, network, router, path]);
}

export function getChainIdFromQuery(query: ParsedUrlQuery) {
  return (
    (Array.isArray(query.chainId) ? Number(query.chainId[0]) : Number(query.chainId)) ||
    ChainId.Mainnet
  );
}
