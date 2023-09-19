import Image from 'next/image';
import { PropsWithChildren } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import Clock from 'src/images/icons/clock.svg';
import { VoteType } from 'src/types';
import { showToast } from 'src/utils/toast';
import { StCelo } from 'src/utils/tokens';

const ToastContent = ({ children }: PropsWithChildren) => (
  <span className="text-[16px] leading-[24px] font-medium text-color-modal">{children}</span>
);

export const showStakingToast = (amount: StCelo) =>
  showToast(
    <TokenIcon token="stCELO" width={32} height={32} />,
    <ToastContent>
      You received <br /> {amount.displayAsBase()} stCELO
    </ToastContent>
  );

export const showUnstakingToast = () =>
  showToast(
    <Image
      src={Clock}
      alt="Clock"
      quality={100}
      width={32}
      height={32}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />,
    <ToastContent>You started unstaking, funds available in 3 days.</ToastContent>
  );

export const showElectionToast = () => {
  showToast(
    <ThemedIcon name="arrow" alt="Change" />,
    <ToastContent>Validator Group Selection Strategy Changed</ToastContent>
  );
};

export const showHashToast = (hash: string) => {
  return showToast(
    <ThemedIcon name="receive_info" alt="Receive" />,
    <ToastContent>
      Transaction submitted <br />{' '}
      <small className="text-ellipsis truncate">{hash.slice(0, 36) + '...'}</small>
    </ToastContent>
  );
};

export const showVoteToast = ({ vote, proposalID }: { vote: VoteType; proposalID: string }) => {
  showToast(
    <ThemedIcon name="arrow" alt="Change" />,
    <ToastContent>
      Voted {vote} for proposal #{proposalID}
    </ToastContent>
  );
};

export const showErrorToast = (message: string) => {
  showToast(
    <ThemedIcon name="receive_info" alt="Error" />,
    <ToastContent>{message}</ToastContent>,
    'error'
  );
};

export const showClipboardToast = () => {
  showToast(
    <ThemedIcon name="clipboard" alt="Copy to clipboard" />,
    <ToastContent>Copied to clipboard!</ToastContent>,
    'success',
    1000
  );
};
