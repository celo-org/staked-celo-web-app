import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo, StCelo } from 'src/utils/tokens';
import { useBalance } from 'wagmi';

export const useAccountBalances = (address: string | undefined) => {
  const { stCeloContract } = useBlockchain();
  const { data: rawCeloBalance } = useBalance({
    address: address as `0x${string}`,
  });
  const [stCeloBalance, setStCeloBalance] = useState(new StCelo(0));
  const celoBalance = useMemo(() => new Celo(rawCeloBalance || 0), [rawCeloBalance]);

  const loadStCeloBalance = useCallback(async () => {
    if (!address || !stCeloContract) {
      return;
    }

    const stCeloBalance = await stCeloContract.contract.read.balanceOf([address]);

    setStCeloBalance(new StCelo(stCeloBalance));
  }, [address, stCeloContract]);

  useEffect(() => {
    void loadStCeloBalance();
  }, [address, loadStCeloBalance]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances: loadStCeloBalance,
  };
};
