import Image from 'next/image';
import { PropsWithChildren } from 'react';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import Clock from 'src/images/icons/clock.svg';
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
    <Image src={Clock} alt="Clock" quality={100} width={32} height={32} />,
    <ToastContent>You started unstaking, funds available in 3 days.</ToastContent>
  );
