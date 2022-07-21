import { SolidButton } from 'src/components/buttons/SolidButton';
import { StakeToken } from 'src/features/swap/types';

interface ButtonProps {
  color: 'purple' | 'orange';
  toToken: StakeToken;
  pending: boolean;
}

const getText = (toToken: StakeToken) => {
  if (toToken === 'stCELO') {
    return 'Stake';
  } else if (toToken === 'CELO') {
    return 'Unstake';
  }

  return '';
};

export const SubmitButton = ({ color, toToken, pending }: ButtonProps) => {
  return (
    <SolidButton color={color} type="submit" classes="w-full h-14" disabled={pending}>
      {pending ? 'Loading...' : getText(toToken)}
    </SolidButton>
  );
};
