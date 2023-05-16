import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Celo, StCelo } from 'src/utils/tokens';
import { useBalance } from 'wagmi';

export const useAccountBalances = (address: string | undefined) => {
  const { stCeloContract } = useBlockchain();
  const { data: rawCeloBalance } = useBalance({
    address: address as `0x${string}`,
  });
  const [celoBalance, setCeloBalance] = useState(new Celo(0));
  const [stCeloBalance, setStCeloBalance] = useState(new StCelo(0));

  const loadStCeloBalance = useCallback(async () => {
    if (!address || !stCeloContract) {
      return;
    }

    // @ts-expect-error
    const stCeloBalance = await stCeloContract.contract.read.balanceOf([address]);

    setStCeloBalance(new StCelo(stCeloBalance));
  }, [address, stCeloContract]);

  useEffect(() => {
    void loadStCeloBalance();
  }, [address, loadStCeloBalance]);

  useEffect(() => {
    if (rawCeloBalance) {
      setCeloBalance(new Celo(rawCeloBalance));
    }
  }, [rawCeloBalance]);

  return {
    celoBalance,
    stCeloBalance,
    loadBalances: loadStCeloBalance,
  };
};
