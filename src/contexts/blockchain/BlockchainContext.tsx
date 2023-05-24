import { disconnect } from '@wagmi/core';
import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';
import ManagerABI from 'src/blockchain/ABIs/Manager';
import { mainnetAddresses, testnetAddresses } from 'src/config/contracts';
import useAddresses from 'src/hooks/useAddresses';
import { isSanctionedAddress } from 'src/utils/sanctioned';
import { useAccount } from 'wagmi';

export interface TxCallbacks {
  onSent?: () => void;
}

interface BlockchainContext {
  addresses: typeof mainnetAddresses | typeof testnetAddresses;
  managerContract: {
    address: `0x${string}` | undefined;
    abi: typeof ManagerABI;
  };
}

export const BlockchainContext = createContext<BlockchainContext>({
  addresses: mainnetAddresses,
  managerContract: {
    address: undefined,
    abi: ManagerABI,
  },
});

export const BlockchainProvider = ({ children }: PropsWithChildren) => {
  const { address } = useAccount();
  const addresses = useAddresses();
  const managerContract = useMemo(
    () => ({
      address: addresses.manager,
      abi: ManagerABI,
    }),
    [addresses]
  );

  useEffect(() => {
    void (async () => {
      const sanctioned = address && (await isSanctionedAddress(address));
      if (sanctioned) {
        await disconnect();
      }
    })();
  }, [address]);

  return (
    <BlockchainContext.Provider
      value={{
        addresses,
        managerContract,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
