import { useCelo } from '@celo/react-celo';
import { useCallback, useMemo } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account.json';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import StCeloABI from 'src/blockchain/ABIs/StakedCelo.json';
import { accountAddress, managerAddress, stCeloAddress } from 'src/config/contracts';
import { AbiItem } from 'web3-utils';

interface TxOptions {
  from: string;
  gasPrice: string;
  gas: string;
  value?: string;
}

export function useBlockchain() {
  const { kit } = useCelo();

  const managerContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(ManagerABI as AbiItem[], managerAddress);
  }, [kit.connection]);

  const stCeloContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(StCeloABI as AbiItem[], stCeloAddress);
  }, [kit.connection]);

  const accountContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(AccountABI as AbiItem[], accountAddress);
  }, [kit.connection]);

  const sendTransaction = useCallback(
    async (txObject: any, txOptions: TxOptions) => {
      const tx = await kit.connection.sendTransactionObject(txObject, txOptions);
      await tx.waitReceipt();
    },
    [kit.connection]
  );

  return {
    managerContract,
    stCeloContract,
    accountContract,
    sendTransaction,
  };
}
