import EpochRewards from '@celo/abis/EpochRewards.json';
import GasPriceMinimum from '@celo/abis/GasPriceMinimum.json';
import Registry from '@celo/abis/Registry.json';
import SortedOracles from '@celo/abis/SortedOracles.json';
import StableToken from '@celo/abis/StableToken.json';
import { COMPLIANT_ERROR_RESPONSE } from 'compliance-sdk';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account.json';
import ManagerABI from 'src/blockchain/ABIs/Manager.json';
import VoteABI from 'src/blockchain/ABIs/Vote.json';
import { mainnetAddresses, testnetAddresses } from 'src/config/contracts';
import { isSanctionedAddress } from 'src/utils/sanctioned';
import { createPublicClient, getContract, http } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { Celo } from '@celo/rainbowkit-celo/chains';

export interface TxCallbacks {
  onSent?: () => void;
}

/**
 * TODO: figure out how to obtain that type without using typeof and doing a dummy BS
 */
const __dummyContract = getContract({
  address: '0x0',
  abi: Registry.abi,
  publicClient: createPublicClient({
    chain: Celo,
    transport: http(),
  }),
});
interface Contract {
  address: string;
  contract: typeof __dummyContract;
}

interface BlockchainContext {
  epochRewardsContract: EpochRewardsContract | undefined;
  sortedOraclesContract: SortedOraclesContract | undefined;
  stableTokenContract: StableTokenContract | undefined;
  gasPriceMinimumContract: GasPriceMinimumContract | undefined;
  managerContract: Manager | undefined;
  stCeloContract: StakedCelo | undefined;
  accountContract: Account | undefined;
  voteContract: Vote | undefined;
  addresses: typeof mainnetAddresses | typeof testnetAddresses;
  sendTransaction: (
    txObject: unknown,
    txOptions: TxOptions,
    callbacks?: TxCallbacks
  ) => Promise<void>;
}

export const BlockchainContext = createContext<BlockchainContext>({
  epochRewardsContract: undefined,
  sortedOraclesContract: undefined,
  stableTokenContract: undefined,
  gasPriceMinimumContract: undefined,
  managerContract: undefined,
  stCeloContract: undefined,
  accountContract: undefined,
  voteContract: undefined,
  addresses: mainnetAddresses,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendTransaction: (_viemRequest: unknown) => Promise.resolve(undefined),
});

export const BlockchainProvider = ({ children }: PropsWithChildren) => {
  const publicClient = usePublicClient();
  const { data: client } = useWalletClient();

  const addresses = useMemo(() => {
    if (publicClient.chain.id === celo.id) return mainnetAddresses;
    return testnetAddresses;
  }, [publicClient]);

  const REGISTRY_CONTRACT_ADDRESS = '0x000000000000000000000000000000000000ce10';
  const registryContract = useMemo(
    () =>
      getContract({
        address: REGISTRY_CONTRACT_ADDRESS,
        abi: Registry.abi,
        publicClient,
      }),
    [publicClient]
  );

  const managerContract = useMemo<Contract>(
    () => ({
      address: addresses.manager,
      contract: getContract({
        address: addresses.manager,
        abi: ManagerABI,
        publicClient,
      }),
    }),
    [addresses, publicClient]
  );

  const stCeloContract = useMemo<Contract>(
    () =>
      ({
        address: addresses.stakedCelo,
        contract: getContract({ address: addresses.stakedCelo, abi: StCeloABI, publicClient }),
      } as Contract),
    [addresses.stakedCelo, publicClient]
  );
  const accountContract = useMemo<Contract>(
    () =>
      ({
        address: addresses.account,
        contract: getContract({ address: addresses.account, abi: AccountABI, publicClient }),
      } as Contract),
    [addresses.account, publicClient]
  );
  const voteContract = useMemo<Contract>(
    () =>
      ({
        address: addresses.vote,
        contract: getContract({ address: addresses.vote, abi: VoteABI, publicClient }),
      } as Contract),
    [addresses.vote, publicClient]
  );

  const sendTransaction = useCallback(
    async (request: any, callbacks?: TxCallbacks) => {
      if (!client) {
        throw new Error('Couldnt get wallet client, are you connected?');
      }
      if (await isSanctionedAddress(request.account)) {
        throw new Error(COMPLIANT_ERROR_RESPONSE);
      }
      const hash = await client.writeContract(request);
      if (callbacks?.onSent) callbacks.onSent();
      await publicClient.waitForTransactionReceipt({ hash });
    },
    [client, publicClient]
  );

  const [epochRewardsContract, setEpochRewardsContract] = useState<Contract>();
  useEffect(
    () =>
      void registryContract.read.getAddressForString(['EpochRewards']).then((result) => {
        const address = result as `0x${string}`;
        setEpochRewardsContract({
          address,
          contract: getContract({
            address,
            abi: EpochRewards.abi,
            publicClient,
          }),
        });
      }),
    [publicClient, registryContract]
  );

  const [sortedOraclesContract, setSortedOraclesContract] = useState<Contract>();
  useEffect(
    () =>
      void registryContract.read.getAddressForString(['SortedOracles']).then((result) => {
        const address = result as `0x${string}`;
        setSortedOraclesContract({
          address,
          contract: getContract({
            address,
            abi: SortedOracles.abi,
            publicClient,
          }),
        });
      }),
    [publicClient, registryContract]
  );

  const [stableTokenContract, setStableTokenContract] = useState<Contract>();
  useEffect(
    () =>
      void registryContract.read.getAddressForString(['StableToken']).then((result) => {
        const address = result as `0x${string}`;
        setStableTokenContract({
          address,
          contract: getContract({
            address,
            abi: StableToken.abi,
            publicClient,
          }),
        });
      }),
    [publicClient, registryContract]
  );
  const [gasPriceMinimumContract, setGasPriceMinimumContract] = useState<Contract>();
  useEffect(
    () =>
      void registryContract.read.getAddressForString(['GasPriceMinimum']).then((result) => {
        const address = result as `0x${string}`;
        setGasPriceMinimumContract({
          address,
          contract: getContract({
            address,
            abi: GasPriceMinimum.abi,
            publicClient,
          }),
        });
      }),
    [publicClient, registryContract]
  );

  return (
    <BlockchainContext.Provider
      value={{
        epochRewardsContract,
        sortedOraclesContract,
        stableTokenContract,
        gasPriceMinimumContract,
        managerContract,
        stCeloContract,
        accountContract,
        voteContract,
        addresses,
        sendTransaction,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
