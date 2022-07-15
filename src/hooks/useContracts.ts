import { useCelo } from '@celo/react-celo';
import { useMemo } from 'react';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import { managerAddress } from 'src/config/contracts';
import { AbiItem } from 'web3-utils';

export function useContracts() {
  const { kit } = useCelo();

  const managerContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(ManagerABI as AbiItem[], managerAddress);
  }, [kit.connection]);

  return {
    managerContract,
  };
}
