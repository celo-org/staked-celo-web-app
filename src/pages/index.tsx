import type { NextPage } from 'next';
import { StakeForm } from 'src/features/stake/StakeForm';
import { useAccount } from 'src/hooks/useAccount';

const Stake: NextPage = () => {
  const { isConnected } = useAccount();

  console.log(isConnected);
  return <StakeForm />;
};

export default Stake;
