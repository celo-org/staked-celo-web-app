import Image from 'next/image';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import Clock from 'src/images/icons/clock.svg';
import { showToast } from 'src/utils/toast';
import { StCelo } from 'src/utils/tokens';

export const showStakingToast = (amount: StCelo) =>
  showToast(<TokenIcon token="stCELO" />, <span>You received {amount.format()} stCELO</span>);

export const showUnstakingToast = () =>
  showToast(
    <Image src={Clock} alt="Clock" quality={100} width={32} height={32} />,
    <span>You started unstaking, funds available in 3 days.</span>
  );
