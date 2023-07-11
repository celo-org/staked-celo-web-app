import celoRegistry from 'src/utils/celoRegistry';
import { useContractRead } from 'wagmi';

export default function useCeloRegistryAddress(contractName: string) {
  const { data: address } = useContractRead({
    address: celoRegistry.address,
    abi: celoRegistry.abi,
    functionName: 'getAddressForString',
    args: [contractName],
  });

  if (address && parseInt(address, 16) === 0) {
    return undefined;
  }
  return address;
}
