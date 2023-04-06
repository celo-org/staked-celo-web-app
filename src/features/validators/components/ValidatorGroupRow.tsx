import { useCelo } from '@celo/react-celo';
import React from 'react';
import { Row } from 'src/components/list/row';
import { removeAddressMiddle } from 'src/features/validators/removeAddressMiddle';
import { appendChainIdToLink } from 'src/utils/appendChainIdToLink';

const ADDRESS_SLICE_POINT_LAST_PART = 37;

interface Props {
  name?: string;
  groupAddress: string;
  isCurrentStrategy?: boolean;
}

export const ValidatorGroupRow = React.memo(({ name, groupAddress, isCurrentStrategy }: Props) => {
  const { network } = useCelo();
  const displayName = name || removeAddressMiddle(groupAddress);
  const baseHref = `validators/${groupAddress}`;
  const href = appendChainIdToLink(baseHref, network.chainId);

  const truncatedAddress = groupAddress.slice(ADDRESS_SLICE_POINT_LAST_PART);

  return (
    <Row name={displayName} href={href} highlighted={isCurrentStrategy}>
      &hellip;{truncatedAddress}
    </Row>
  );
});

ValidatorGroupRow.displayName = 'ValidatorGroupRow';
