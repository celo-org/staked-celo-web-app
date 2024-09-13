import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { showElectionToast, showErrorToast } from 'src/features/swap/utils/toast';
import logger from 'src/services/logger';
import { transactionEvent } from 'src/utils/ga';
import type { Address } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';

export const useChangeStrategy = () => {
  const { managerContract } = useBlockchain();
  const { reloadStrategy } = useAccountContext();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const { writeContractAsync: _changeStrategy } = useWriteContract({});

  /*
   * @param groupAddress the address of validator group OR 0 for default
   */
  const [changeStrategy, status] = useAsyncCallback(
    async (groupAddress: Address, callbacks?: TxCallbacks) => {
      if (!address || !managerContract) {
        throw new Error('change strategy called before loading completed');
      }
      transactionEvent({
        action: 'changeStrategy',
        status: 'initiated_transaction',
        value: '',
      });
      try {
        const tx = await _changeStrategy({
          abi: managerContract.abi,
          address: managerContract.address!,
          functionName: 'changeStrategy',
          args: [groupAddress],
        });
        transactionEvent({
          action: 'changeStrategy',
          status: 'signed_transaction',
          value: '',
        });
        showElectionToast();
        // otherwise reloading could bring up the old one
        await waitForTransactionReceipt(publicClient!, { hash: tx });
        await reloadStrategy?.();
      } catch (e: unknown) {
        logger.error('changeStrategy error', e);
        showErrorToast(
          (e as Error).message.includes('rejected')
            ? 'User rejected the request'
            : (e as Error).message
        );
      } finally {
        callbacks?.onSent?.();
      }
    },
    [address, managerContract, reloadStrategy]
  );

  return { changeStrategy, ...status };
};
