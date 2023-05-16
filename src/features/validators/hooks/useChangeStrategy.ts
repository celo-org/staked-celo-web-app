import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks, useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { showElectionToast } from 'src/features/swap/utils/toast';
import { transactionEvent } from 'src/utils/ga';
import { useAccount } from 'wagmi';

export const useChangeStrategy = () => {
  const { managerContract, sendTransaction } = useBlockchain();
  const { suggestedGasPrice } = useProtocolContext();
  const { reloadStrategy } = useAccountContext();
  const { address } = useAccount();

  /*
   * @param groupAddress the address of validator group OR 0 for default
   */
  const [changeStrategy, status] = useAsyncCallback(
    async (groupAddress: string, callbacks?: TxCallbacks) => {
      if (!address || !managerContract) {
        throw new Error('change strategy called before loading completed');
      }
      const { request } = await managerContract.contract.simulate.changeStrategy({
        account: address,
        args: [groupAddress],
      });
      transactionEvent({
        action: 'changeStrategy',
        status: 'initiated_transaction',
        value: '',
      });
      await sendTransaction(request, callbacks);
      transactionEvent({
        action: 'changeStrategy',
        status: 'signed_transaction',
        value: '',
      });
      showElectionToast();
      await reloadStrategy(address);
    },
    [address, suggestedGasPrice, managerContract, reloadStrategy]
  );

  return { changeStrategy, ...status };
};
