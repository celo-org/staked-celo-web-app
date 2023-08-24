import { useMemo } from 'react';
import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Modal } from 'src/components/modals/Modal';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import CurrentVotingBalanceDetails from 'src/features/governance/components/CurrentVotingBalanceDetails';
import { useVote } from 'src/features/governance/hooks/useVote';
import { showClipboardToast } from 'src/features/swap/utils/toast';
import { useAccount } from 'wagmi';

export const AccountModal = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  const { address } = useAccount();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { lockedStCeloInVoting, lockedVoteBalance, unlockVoteBalance } = useVote();
  const title = 'Wallet information';

  const addressLabel = useMemo(() => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  }, [address]);

  return (
    <Modal isOpen={isOpen} screenReaderLabel={title} close={close}>
      <div className="flex flex-col bg-secondary text-color-primary p-[24px]">
        <div className="flex justify-between items-center text-[20px] leading-[24px] mb-[32px]">
          <div className="flex items-center gap-4">
            <span>{addressLabel}</span>
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
          <div className="cursor-pointer bg-tertiary rounded-full flex center p-1">
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
      </div>
    </Modal>
  );
};
