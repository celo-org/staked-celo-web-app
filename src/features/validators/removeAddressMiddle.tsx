const ADDRESS_SLICE_POINT_A = 5;
const ADDRESS_SLICE_POINT_B = 38;
export function removeAddressMiddle(addr: string) {
  return `${addr.slice(0, ADDRESS_SLICE_POINT_A)}…${addr.slice(ADDRESS_SLICE_POINT_B)}`;
}
