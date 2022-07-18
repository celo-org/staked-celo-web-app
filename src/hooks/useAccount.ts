import { useCelo } from '@celo/react-celo';
import BigNumber from 'bignumber.js';
import { useCallback, useContext } from 'react';
import { useContracts } from 'src/hooks/useContracts';
import { AccountContext } from 'src/providers/AccountProvider';

export function useAccount() {
  const { address: _address, kit } = useCelo();
  const { celoBalance, setCeloBalance, stakedCeloBalance, setStakedCeloBalance } =
    useContext(AccountContext);
  const { stakedCeloContract } = useContracts();
  const address = _address ?? undefined;
  const isConnected = !!address;

  const loadCeloBalance = useCallback(async () => {
    const { eth } = kit.connection.web3;
    if (!address) return;

    const balance = await eth.getBalance(address);

    setCeloBalance(new BigNumber(balance));
  }, [kit.connection, address, setCeloBalance]);

  const loadStakedCeloBalance = useCallback(async () => {
    const stakedCeloBalance = await stakedCeloContract.methods.balanceOf(address).call({
      from: address,
    });
    setStakedCeloBalance(new BigNumber(stakedCeloBalance));
  }, [address, stakedCeloContract, setStakedCeloBalance]);

  return {
    isConnected,
    address,
    celoBalance,
    loadCeloBalance,
    stakedCeloBalance,
    loadStakedCeloBalance,
  };
}
