import { useCelo } from '@celo/react-celo';

export const useAddress = () => {
  const { address: _address } = useCelo();
  const address = _address ?? null;
  const isConnected = !!address;
  return { isConnected, address };
};
