import { useCelo } from '@celo/react-celo';
import { useMemo } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account.json';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import StakedCeloABI from 'src/blockchain/ABIs/StakedCelo.json';
import { accountAddress, managerAddress, stakedCeloAddress } from 'src/config/contracts';
import { AbiItem } from 'web3-utils';

export function useContracts() {
  const { kit } = useCelo();

  const managerContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(ManagerABI as AbiItem[], managerAddress);
  }, [kit.connection]);

  const stakedCeloContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(StakedCeloABI as AbiItem[], stakedCeloAddress);
  }, [kit.connection]);

  const accountContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(AccountABI as AbiItem[], accountAddress);
  }, [kit.connection]);

  return {
    managerContract,
    stakedCeloContract,
    accountContract,
  };
}
