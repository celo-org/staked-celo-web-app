import { ContractKit, newKit } from '@celo/contractkit';
import { useCelo } from '@celo/react-celo';
import { COMPLIANT_ERROR_RESPONSE } from 'compliance-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account.json';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import StCeloABI from 'src/blockchain/ABIs/StakedCelo.json';
import { mainnetAddresses, testnetAddresses } from 'src/config/contracts';
import { isSanctionedAddress } from 'src/utils/sanctioned';
import { AbiItem } from 'web3-utils';

interface TxOptions {
  from: string;
  value?: string;
}

export interface TxCallbacks {
  onSent?: () => void;
}

type EpochRewardsContract = Awaited<ReturnType<ContractKit['_web3Contracts']['getEpochRewards']>>;
type SortedOraclesContract = Awaited<ReturnType<ContractKit['contracts']['getSortedOracles']>>;
type StableTokenContract = Awaited<ReturnType<ContractKit['contracts']['getStableToken']>>;
type GasPriceMinimumContract = Awaited<ReturnType<ContractKit['contracts']['getGasPriceMinimum']>>;

export function useBlockchain() {
  const { kit, network } = useCelo();
  const contractKit = useMemo(() => newKit(network.rpcUrl), [network]);

  // react-celo doesn't update network when it's changed second time
  // Hence we need to reload application after the first change
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  useEffect(() => {
    if (!network.name) return;
    if (!currentNetwork) {
      setCurrentNetwork(network.name);
      return;
    }
    if (currentNetwork !== network.name) location.reload();
  }, [network, currentNetwork]);

  const addresses = useMemo(() => {
    if (network.name === 'Mainnet') return mainnetAddresses;
    return testnetAddresses;
  }, [network]);

  const managerContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(ManagerABI as AbiItem[], addresses.manager);
  }, [kit.connection, addresses]);

  const stCeloContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(StCeloABI as AbiItem[], addresses.stakedCelo);
  }, [kit.connection, addresses]);

  const accountContract = useMemo(() => {
    const { eth } = kit.connection.web3;
    return new eth.Contract(AccountABI as AbiItem[], addresses.account);
  }, [kit.connection, addresses]);

  const sendTransaction = useCallback(
    async (txObject: any, txOptions: TxOptions, callbacks?: TxCallbacks) => {
      if (await isSanctionedAddress(txOptions.from)) {
        throw new Error(COMPLIANT_ERROR_RESPONSE);
      }
      const tx = await kit.connection.sendTransactionObject(txObject, {
        ...txOptions,
      });
      await tx.getHash();
      if (callbacks?.onSent) callbacks.onSent();
      await tx.waitReceipt();
    },
    [kit.connection]
  );

  const [epochRewardsContract, setEpochRewardsContract] = useState<EpochRewardsContract>();
  useEffect(
    () => void contractKit._web3Contracts.getEpochRewards().then(setEpochRewardsContract),
    [contractKit]
  );

  const [sortedOraclesContract, setSortedOraclesContract] = useState<SortedOraclesContract>();
  useEffect(
    () => void contractKit.contracts.getSortedOracles().then(setSortedOraclesContract),
    [contractKit]
  );

  const [stableTokenContract, setStableTokenContract] = useState<StableTokenContract>();
  useEffect(
    () => void contractKit.contracts.getStableToken().then(setStableTokenContract),
    [contractKit]
  );
  const [gasPriceMinimumContract, setGasPriceMinimumContract] = useState<GasPriceMinimumContract>();
  useEffect(
    () => void contractKit.contracts.getGasPriceMinimum().then(setGasPriceMinimumContract),
    [contractKit]
  );

  return {
    epochRewardsContract,
    sortedOraclesContract,
    stableTokenContract,
    gasPriceMinimumContract,
    managerContract,
    stCeloContract,
    accountContract,
    sendTransaction,
  };
}
