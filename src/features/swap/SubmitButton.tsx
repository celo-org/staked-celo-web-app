import { SolidButton } from 'src/components/buttons/SolidButton';
import { StakeToken } from 'src/features/swap/types';

interface ButtonProps {
  color: 'purple' | 'orange';
  toToken: StakeToken;
}

const getText = (toToken: StakeToken) => {
  if (toToken === 'stCELO') {
    return 'Stake';
  } else if (toToken === 'CELO') {
    return 'Unstake';
  }

  return '';
};

export const SubmitButton = ({ color, toToken }: ButtonProps) => {
  return (
    <SolidButton color={color} type="submit" classes="w-full h-14">
      {getText(toToken)}
    </SolidButton>
  );
};
