import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Mode } from '../types';

interface ButtonProps {
  mode: Mode;
  pending: boolean;
  disabled?: boolean;
}

const getText = (mode: Mode) => {
  if (mode === 'stake') return 'Stake';
  if (mode === 'unstake') return 'Unstake';
  return '';
};

export const SubmitButton = ({ mode, pending, disabled }: ButtonProps) => {
  /* It has to be defined like this, otherwise Tailwind will not build CSS classes */
  const unstakeClasses =
    'bg-action-primary-regular disabled:bg-action-primary-light hover:bg-action-primary-dark active:bg-action-primary-light';
  const stakeClasses =
    'bg-action-secondary-regular disabled:bg-action-secondary-light hover:bg-action-secondary-dark active:bg-action-secondary-light';

  return (
    <Button
      type="submit"
      classes={`${mode === 'stake' ? stakeClasses : unstakeClasses} text-contrast w-full h-14`}
      disabled={disabled || pending}
    >
      {pending ? (
        <ThemedIcon classes="animate-spin" name="spinner" alt="Spinner" width={40} height={40} />
      ) : (
        getText(mode)
      )}
    </Button>
  );
};
