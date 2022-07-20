import { useCelo } from '@celo/react-celo';
import { useMemo } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account.json';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import StakedCeloABI from 'src/blockchain/ABIs/StakedCelo.json';
import { accountAddress, managerAddress, stCeloAddress } from 'src/config/contracts';
import { AbiItem } from 'web3-utils';

export function useContracts() {
  const { kit } = useCelo();

  const managerContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(ManagerABI as AbiItem[], managerAddress);
  }, [kit.connection]);

  const stCeloContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(StakedCeloABI as AbiItem[], stCeloAddress);
  }, [kit.connection]);

  const accountContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(AccountABI as AbiItem[], accountAddress);
  }, [kit.connection]);

  return {
    managerContract,
    stCeloContract,
    accountContract,
  };
}
