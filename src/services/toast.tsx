import Image from 'next/image';
import { toast as reactToast } from 'react-toastify';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import Clock from 'src/images/icons/clock.svg';
import { StCeloWei } from 'src/utils/tokens';

const toast = {
  stakingSuccess: (amount: StCeloWei) =>
    reactToast.success(<span>You received {amount.format()} stCELO</span>, {
      icon: () => <TokenIcon token="stCELO" />,
    }),
  unstakingStartedSuccess: () =>
    reactToast.success(<span>You started unstaking, funds available in 3 days.</span>, {
      icon: () => <Image src={Clock} alt="Clock" quality={100} width={32} height={32} />,
    }),
};

export default toast;
