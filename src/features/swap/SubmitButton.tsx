import { SolidButton } from 'src/components/buttons/SolidButton';
import { StakeToken } from 'src/features/swap/types';

interface ButtonProps {
  toToken: StakeToken;
  pending: boolean;
}

const getText = (toToken: StakeToken) => {
  if (toToken === 'stCELO') return 'Stake';
  if (toToken === 'CELO') return 'Unstake';

  return '';
};

const getColor = (toToken: StakeToken) => {
  if (toToken === 'stCELO') return 'purple';
  if (toToken === 'CELO') return 'orange';

  return undefined;
};

export const SubmitButton = ({ toToken, pending }: ButtonProps) => {
  return (
    <SolidButton color={getColor(toToken)} type="submit" classes="w-full h-14" disabled={pending}>
      {pending ? 'Loading...' : getText(toToken)}
    </SolidButton>
  );
};
