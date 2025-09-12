import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';
import AccountABI from 'src/blockchain/ABIs/Account';
import DefaultGroupStrategyABI from 'src/blockchain/ABIs/DefaultGroupStrategy';
import GroupHealthABI from 'src/blockchain/ABIs/GroupHealth';
import ManagerABI from 'src/blockchain/ABIs/Manager';
import SpecificGroupStrategyABI from 'src/blockchain/ABIs/SpecificGroupStrategy';
import StakedCeloABI from 'src/blockchain/ABIs/StakedCelo';
import VoteABI from 'src/blockchain/ABIs/Vote';
import { mainnetAddresses, testnetAddresses } from 'src/config/contracts';
import useAddresses from 'src/hooks/useAddresses';
import { Option } from 'src/types';
import { isSanctionedAddress } from 'src/utils/sanctioned';
import { walletConnectCleanup } from 'src/utils/walletconnect';
import type { Address } from 'viem';
import { useAccount, useDisconnect } from 'wagmi';

export interface TxCallbacks {
  onSent?: () => void;
}

interface Contract<T> {
  address: Option<Address>;
  abi: T;
}

interface BlockchainContext {
  addresses: typeof mainnetAddresses | typeof testnetAddresses;
  managerContract: Contract<typeof ManagerABI>;
  accountContract: Contract<typeof AccountABI>;
  stakedCeloContract: Contract<typeof StakedCeloABI>;
  voteContract: Contract<typeof VoteABI>;
  groupHealthContract: Contract<typeof GroupHealthABI>;
  specificGroupStrategyContract: Contract<typeof SpecificGroupStrategyABI>;
  defaultGroupStrategyContract: Contract<typeof DefaultGroupStrategyABI>;
}

export const BlockchainContext = createContext<BlockchainContext>({
  addresses: mainnetAddresses,
  managerContract: {
    address: undefined,
    abi: ManagerABI,
  },
  accountContract: {
    address: undefined,
    abi: AccountABI,
  },
  stakedCeloContract: {
    address: undefined,
    abi: StakedCeloABI,
  },
  voteContract: {
    address: undefined,
    abi: VoteABI,
  },
  groupHealthContract: {
    address: undefined,
    abi: GroupHealthABI,
  },
  specificGroupStrategyContract: {
    address: undefined,
    abi: SpecificGroupStrategyABI,
  },
  defaultGroupStrategyContract: {
    address: undefined,
    abi: DefaultGroupStrategyABI,
  },
});

export const BlockchainProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect()
  const addresses = useAddresses();
  const managerContract = useMemo(
    () => ({
      address: addresses.manager,
      abi: ManagerABI,
    }),
    [addresses]
  );
  const accountContract = useMemo(
    () => ({
      address: addresses.account,
      abi: AccountABI,
    }),
    [addresses]
  );
  const stakedCeloContract = useMemo(
    () => ({
      address: addresses.stakedCelo,
      abi: StakedCeloABI,
    }),
    [addresses]
  );
  const voteContract = useMemo(
    () => ({
      address: addresses.vote,
      abi: VoteABI,
    }),
    [addresses]
  );
  const groupHealthContract = useMemo(
    () => ({
      address: addresses.groupHealth,
      abi: GroupHealthABI,
    }),
    [addresses]
  );
  const defaultGroupStrategyContract = useMemo(
    () => ({
      address: addresses.defaultGroupStrategy,
      abi: DefaultGroupStrategyABI,
    }),
    [addresses]
  );
  const specificGroupStrategyContract = useMemo(
    () => ({
      address: addresses.specificGroupStrategy,
      abi: SpecificGroupStrategyABI,
    }),
    [addresses]
  );
  useEffect(() => {
    void (async () => {
      const sanctioned = address && (await isSanctionedAddress(address));
      if (sanctioned) {
        await disconnectAsync();
        await walletConnectCleanup();
      }
    })();
  }, [address, disconnectAsync]);

  return (
    <BlockchainContext.Provider
      value={{
        addresses,
        managerContract,
        accountContract,
        stakedCeloContract,
        voteContract,
        groupHealthContract,
        specificGroupStrategyContract,
        defaultGroupStrategyContract,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
