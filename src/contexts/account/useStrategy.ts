import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useContractRead } from 'wagmi';

// don't call directly. for use in AccountContext
// returns the address of the  validator group the currently connected address is voting for OR the zero if on default
export default function useStrategy(address: `0x${string}` | undefined) {
  const { managerContract } = useBlockchain();
  const {
    data: strategy,
    isLoading,
    refetch: reloadStrategy,
  } = useContractRead({
    abi: managerContract.abi,
    address: address ? managerContract.address : undefined,
    functionName: 'getAddressStrategy',
    args: [address!],
  });

  return { strategy, reloadStrategy, isLoading };
}
