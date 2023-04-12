import { useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import logger from 'src/services/logger';

// don't call directly. for use in AccountContext
// returns the address of the  validator group the currently connected address is voting for OR the zero if on default
export default function useStrategy(address: string | null) {
  const { managerContract } = useBlockchain();
  const [strategy, setStrategy] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    if (!managerContract || !address) {
      return;
    }
    console.info('addres', address);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const getStrategy = async () => {
      const strategyFromChain = await managerContract?.methods.getAddressStrategy(address).call();
      if (isSubscribed) {
        setStrategy(strategyFromChain);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getStrategy().catch(logger.error);

    return () => {
      isSubscribed = false;
    };
  }, [managerContract, address]);

  return strategy;
}
