import { useRegistryGetAddressForString } from 'src/blockchain/ABIs/Celo';
import celoRegistry from 'src/utils/celoRegistry';

// TODO: how could I use import type {CeloContract} from '@celo/contractkit' here
export default function useCeloRegistryAddress(contractName: string) {
  const { data: address } = useRegistryGetAddressForString({
    address: celoRegistry.address,
    args: [contractName],
  });

  if (address && parseInt(address, 16) === 0) {
    return undefined;
  }
  return address;
}
