import { useAsyncCallback } from 'react-use-async-callback';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useAccountAddress } from 'src/contexts/account/useAddress';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { showElectionToast } from 'src/features/swap/utils/toast';
import { transactionEvent } from 'src/utils/ga';

export const useChangeStrategy = () => {
  const { managerContract, sendTransaction } = useBlockchain();
  const { suggestedGasPrice } = useProtocolContext();
  const { reloadStrategy } = useAccountContext();
  const { address } = useAccountAddress();

  /*
   * @param groupAddress the address of validator group OR 0 for default
   */
  const [changeStrategy, status] = useAsyncCallback(
    async (groupAddress: string) => {
      if (!address || !managerContract) {
        throw new Error('change strategy called before loading completed');
      }
      const changeStrategyTxObject = managerContract?.methods.changeStrategy(groupAddress);
      const txOptions = { from: address, gasPrice: suggestedGasPrice };
      transactionEvent({
        action: 'changeStrategy',
        status: 'initiated_transaction',
        value: '',
      });
      await sendTransaction(changeStrategyTxObject, txOptions);
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
