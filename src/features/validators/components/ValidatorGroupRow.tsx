import React from 'react';
import { Row } from 'src/components/list/row';
import { removeAddressMiddle } from 'src/features/validators/removeAddressMiddle';
const ADDRESS_SLICE_POINT_LAST_PART = 37;

interface Props {
  name?: string;
  groupAddress: string;
  isCurrentStrategy?: boolean;
}

export const ValidatorGroupRow = React.memo(({ name, groupAddress, isCurrentStrategy }: Props) => {
  const displayName = name || removeAddressMiddle(groupAddress);
  const href = `validators/${groupAddress}`;

  const truncatedAddress = groupAddress.slice(ADDRESS_SLICE_POINT_LAST_PART);

  return (
    <Row name={displayName} href={href} highlighted={isCurrentStrategy}>
      &hellip;{truncatedAddress}
    </Row>
  );
});

ValidatorGroupRow.displayName = 'ValidatorGroupRow';
