import { ContractKit, newKit, StableToken } from '@celo/contractkit';
import { useCelo } from '@celo/react-celo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account.json';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import StCeloABI from 'src/blockchain/ABIs/StakedCelo.json';
import { networkConfig } from 'src/config/celo';
import { accountAddress, managerAddress, stCeloAddress } from 'src/config/contracts';
import { AbiItem } from 'web3-utils';
interface TxOptions {
  from: string;
  gasPrice: string;
  gas: string;
  value?: string;
}

type EpochRewardsContract = Awaited<ReturnType<ContractKit['_web3Contracts']['getEpochRewards']>>;
type ExchangeContract = Awaited<ReturnType<ContractKit['contracts']['getExchange']>>;

export function useBlockchain() {
  const { kit } = useCelo();
  const contractKit = useMemo(() => newKit(networkConfig.rpcUrl), []);

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

  const [epochRewardsContract, setEpochRewardsContract] = useState<EpochRewardsContract>();
  useEffect(
    () => void contractKit._web3Contracts.getEpochRewards().then(setEpochRewardsContract),
    [contractKit]
  );

  const [cUSDExchangeContract, setcUSDExchangeContract] = useState<ExchangeContract>();
  useEffect(
    () => void contractKit.contracts.getExchange(StableToken.cUSD).then(setcUSDExchangeContract),
    [contractKit]
  );

  return {
    epochRewardsContract,
    cUSDExchangeContract,
    managerContract,
    stCeloContract,
    accountContract,
    sendTransaction,
  };
}
