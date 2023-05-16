import { useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';

// don't call directly. for use in AccountContext
// returns the address of the  validator group the currently connected address is voting for OR the zero if on default
export default function useStrategy(
  address: string | undefined
): [string | null, (address: string | undefined) => Promise<void>, boolean] {
  const { managerContract } = useBlockchain();
  const [strategy, setStrategy] = useState<string | null>(null);

  const [loadStrategy, status] = useAsyncCallback(
    async (address: string | undefined) => {
      if (!managerContract || !address) {
        return;
      }
      const strategyFromChain = (await managerContract?.contract.read.getAddressStrategy([
        address,
      ])) as string;
      setStrategy(strategyFromChain);
    },
    [managerContract]
  );

  const isLoading = status.isExecuting;

  useEffect(() => {
    void loadStrategy(address);
  }, [address, loadStrategy]);

  return [strategy, loadStrategy, isLoading];
}
