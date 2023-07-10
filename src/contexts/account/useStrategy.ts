import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Option } from 'src/types';
import { Address, useContractRead } from 'wagmi';

// don't call directly. for use in AccountContext
// returns the address of the  validator group the currently connected address is voting for OR the zero if on default
export default function useStrategy(address: Option<Address>) {
  const { managerContract } = useBlockchain();
  const {
    data: strategy,
    isLoading,
    refetch: reloadStrategy,
  } = useContractRead({
    ...managerContract,
    functionName: 'getAddressStrategy',
    args: [address!],
    enabled: !!address,
  });

  return { strategy, reloadStrategy, isLoading };
}
