import { useId } from 'react';
import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';

interface VoteButtonProps {
  pending: boolean;
  disabled?: boolean;
}

export const VoteButton = ({ pending, disabled }: VoteButtonProps) => {
  const id = useId();
  const classes =
    'bg-action-primary-regular disabled:bg-action-primary-light hover:bg-action-primary-dark active:bg-action-primary-light';
  return (
    <Button
      type="submit"
      classes={`${classes} text-color-contrast w-full`}
      disabled={disabled || pending}
    >
      {pending ? (
        <ThemedIcon classes="animate-spin" name="spinner" alt="Spinner" width={40} height={40} />
      ) : (
        <OpacityTransition id={id}>
          <div className="w-full inline-flex justify-center">Vote</div>
        </OpacityTransition>
      )}
    </Button>
  );
};
