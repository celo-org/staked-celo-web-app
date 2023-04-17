import { useEffect, useState } from 'react';
import { useAsyncCallback } from 'react-use-async-callback';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';

// don't call directly. for use in AccountContext
// returns the address of the  validator group the currently connected address is voting for OR the zero if on default
export default function useStrategy(
  address: string | null
): [string | null, (address: string | null) => Promise<void>, boolean] {
  const { managerContract } = useBlockchain();
  const [strategy, setStrategy] = useState<string | null>(null);

  const [loadStrategy, status] = useAsyncCallback(
    async (address: string | null) => {
      if (!managerContract || !address) {
        return;
      }
      const strategyFromChain: string = await managerContract?.methods
        .getAddressStrategy(address)
        .call();
      setStrategy(strategyFromChain);
    },
    [managerContract]
  );

  const isLoading = status.isExecuting;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadStrategy(address);
  }, [address, loadStrategy]);

  return [strategy, loadStrategy, isLoading];
}
