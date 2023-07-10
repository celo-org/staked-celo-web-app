import { Celo } from '@celo/rainbowkit-celo/chains';
import Router from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useLayoutEffect } from 'react';
import { Option } from 'src/types';
import { useChainId } from 'wagmi';

// only use on page components
export function useRedirectToConnectedChainIfNeeded(
  chainServerKnowsAbout: Option<number>,
  path: string
) {
  const chainId = useChainId();
  useLayoutEffect(() => {
    const serverSideChainId = chainServerKnowsAbout ?? Router.query.chainId ?? Celo.id;
    if (chainId !== serverSideChainId) {
      void Router.push({
        pathname: path,
        query: chainId === Celo.id ? {} : { chainId },
      });
    }
  }, [chainServerKnowsAbout, path, chainId]);
}

export function getChainIdFromQuery(query: ParsedUrlQuery) {
  return (
    (Array.isArray(query.chainId) ? Number(query.chainId[0]) : Number(query.chainId)) || Celo.id
  );
}
