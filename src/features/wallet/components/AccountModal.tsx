import { useCallback } from 'react';
import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Modal } from 'src/components/modals/Modal';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import CurrentVotingBalanceDetails from 'src/features/governance/components/CurrentVotingBalanceDetails';
import { useVote } from 'src/features/governance/hooks/useVote';
import { showClipboardToast } from 'src/features/swap/utils/toast';
import { walletConnectCleanup } from 'src/utils/walletconnect';
import { useAccount, useDisconnect } from 'wagmi';

export const AccountModal = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { lockedStCeloInVoting, lockedVoteBalance, unlockVoteBalance } = useVote();
  const title = 'Wallet information';

  const onDisconnectClick = useCallback(() => {
    void disconnectAsync().then(walletConnectCleanup);
  }, [disconnectAsync]);

  return (
    <Modal isOpen={isOpen} screenReaderLabel={title} close={close}>
      <div className="flex flex-col bg-secondary text-color-primary p-[24px]">
        <div className="flex justify-between items-center text-[20px] leading-[24px] mb-[32px]">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[14px]">{address}</span>
            <Button
              classes="cursor-pointer h-[24px]"
              onClick={() => {
                if (!address) return;
                void navigator.clipboard.writeText(address);
                void showClipboardToast();
              }}
            >
              <ThemedIcon name="clipboard" alt={`Copy to clipboard`} height={16} width={16} />
            </Button>
          </div>
          <div className="cursor-pointer bg-tertiary rounded-full flex center p-1" onClick={close}>
            <ThemedIcon name="close" alt="Dismiss" width={24} height={24} />
          </div>
        </div>
        <div className="font-normal mb-[24px] text-[16px] leading-[24px]">
          <li className="flex justify-between items-center font-normal mb-[4px]">
            <span className="inline-flex items-center">
              <span className="text-[15px] leading-[24px]">CELO Balance</span>
            </span>
            <span>{celoBalance?.convertToBase().toFixed()}</span>
          </li>
          <li className="flex justify-between items-center font-normal mb-[4px]">
            <span className="inline-flex items-center">
              <span className="text-[15px] leading-[24px]">stCELO Balance</span>
            </span>
            <span>{stCeloBalance?.convertToBase().toFixed()}</span>
          </li>
        </div>

        <CurrentVotingBalanceDetails
          lockedStCeloInVoting={lockedStCeloInVoting}
          lockedVoteBalance={lockedVoteBalance}
          unlockVoteBalance={unlockVoteBalance}
          inModal
        />

        <div className="w-full flex flex-col mt-2">
          <Button classes="self-center px-4 gap-4" onClick={onDisconnectClick}>
            <span>Disconnect</span>
            <ThemedIcon name="exit" alt={`Disconnect wallet`} height={16} width={16} />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
