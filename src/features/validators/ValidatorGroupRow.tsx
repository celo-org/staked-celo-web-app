import React from 'react';
import { Row } from 'src/components/list/row';
const ADDRESS_SLICE_POINT_A = 5;
const ADDRESS_SLICE_POINT_B = 38;
const ADDRESS_SLICE_POINT_LAST_PART = 37;

interface Props {
  name: string;
  groupAddress: string;
  isCurrentStrategy?: boolean
}

export const ValidatorGroupRow = React.memo(({ name, groupAddress, isCurrentStrategy }: Props) => {
  const displayName = name.length === 0 ? removeAddressMiddle(groupAddress) : name;
  const href = `validators/${groupAddress}`;

  const truncatedAddress = groupAddress.slice(ADDRESS_SLICE_POINT_LAST_PART);

  return (
    <Row name={displayName} href={href} highlighted={isCurrentStrategy}>
      &hellip;{truncatedAddress}
    </Row>
  );
});

function removeAddressMiddle(addr: string) {
  return `${addr.slice(0, ADDRESS_SLICE_POINT_A)}…${addr.slice(ADDRESS_SLICE_POINT_B)}`;
}

ValidatorGroupRow.displayName = 'ValidatorGroupRow';



