import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { showElectionToast } from 'src/features/swap/utils/toast';
import { transactionEvent } from 'src/utils/ga';
import { useAccount, useContractWrite } from 'wagmi';

export const useChangeStrategy = () => {
  const { managerContract } = useBlockchain();
  const { reloadStrategy } = useAccountContext();
  const { address } = useAccount();

  const { writeAsync: _changeStrategy } = useContractWrite({
    ...managerContract,
    functionName: 'changeStrategy',
  });

  /*
   * @param groupAddress the address of validator group OR 0 for default
   */
  const [changeStrategy, status] = useAsyncCallback(
    async (groupAddress: `0x${string}`, callbacks?: TxCallbacks) => {
      if (!address || !managerContract) {
        throw new Error('change strategy called before loading completed');
      }
      transactionEvent({
        action: 'changeStrategy',
        status: 'initiated_transaction',
        value: '',
      });
      await _changeStrategy?.({
        args: [groupAddress],
      });
      transactionEvent({
        action: 'changeStrategy',
        status: 'signed_transaction',
        value: '',
      });
      showElectionToast();
      await reloadStrategy?.(address);
      callbacks?.onSent?.();
    },
    [address, managerContract, reloadStrategy]
  );

  return { changeStrategy, ...status };
};
