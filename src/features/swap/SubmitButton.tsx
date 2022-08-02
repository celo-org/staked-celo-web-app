import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Token } from 'src/utils/tokens';

interface ButtonProps {
  toToken: Token;
  pending: boolean;
  disabled?: boolean;
}

const getText = (toToken: Token) => {
  if (toToken === 'stCELO') return 'Stake';
  if (toToken === 'CELO') return 'Unstake';

  return '';
};

export const SubmitButton = ({ toToken, pending, disabled }: ButtonProps) => {
  /* It has to be defined like this, otherwise Tailwind will not build CSS classes */
  const stCELOClasses =
    'bg-action-primary-regular disabled:bg-action-primary-light hover:bg-action-primary-dark active:bg-action-primary-light';
  const CELOClasses =
    'bg-action-secondary-regular disabled:bg-action-secondary-light hover:bg-action-secondary-dark active:bg-action-secondary-light';

  return (
    <Button
      type="submit"
      classes={`${toToken === 'stCELO' ? stCELOClasses : CELOClasses} text-contrast w-full h-14`}
      disabled={disabled || pending}
    >
      {pending ? (
        <ThemedIcon classes="animate-spin" name="spinner" alt="Spinner" width={40} height={40} />
      ) : (
        getText(toToken)
      )}
    </Button>
  );
};
