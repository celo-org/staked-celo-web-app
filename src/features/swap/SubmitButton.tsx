import { SolidButton } from 'src/components/buttons/SolidButton';
import { StakeToken } from 'src/features/swap/types';

interface ButtonProps {
  toToken: StakeToken;
  pending: boolean;
  disabled?: boolean;
}

const getText = (toToken: StakeToken) => {
  if (toToken === 'stCELO') return 'Stake';
  if (toToken === 'CELO') return 'Unstake';

  return '';
};

export const SubmitButton = ({ toToken, pending, disabled }: ButtonProps) => {
  const baseClass = 'themed:submit-button';
  const stateClasses = pending ? `${baseClass}--pending` : '';

  return (
    <SolidButton
      type="submit"
      classes={`${baseClass} ${baseClass}--${toToken.toLowerCase()} ${stateClasses} w-full h-14`}
      disabled={disabled || pending}
    >
      {pending ? 'Loading...' : getText(toToken)}
    </SolidButton>
  );
};
