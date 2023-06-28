import { WalletTypes, useCelo } from '@celo/react-celo';
import { Button } from 'src/components/buttons/Button';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { Mode } from '../types';

interface SubmitButtonProps {
  mode: Mode;
  pending: boolean;
  disabled?: boolean;
}

export const SubmitButton = ({ mode, pending, disabled }: SubmitButtonProps) => {

  const { walletType } = useCelo();

  /* It has to be defined like this, otherwise Tailwind will not build CSS classes */
  const stakeClasses =
    'bg-action-primary-regular disabled:bg-action-primary-light hover:bg-action-primary-dark active:bg-action-primary-light';
  const unstakeClasses =
    'bg-action-secondary-regular disabled:bg-action-secondary-light hover:bg-action-secondary-dark active:bg-action-secondary-light';

  return (
    <Button
      type="submit"
      classes={`${mode === 'stake' ? stakeClasses : unstakeClasses} text-color-contrast w-full`}
      disabled={disabled || pending}
    >
      {pending ? (
        <ThemedIcon classes="animate-spin" name="spinner" alt="Spinner" width={40} height={40} />
      ) : (
        <OpacityTransition id={mode}>
          <div className="w-full inline-flex justify-center">{getButtonText(mode, walletType) }</div>
        </OpacityTransition>
      )}
    </Button>
  );
};

const getText = (mode: Mode) => {
  switch (mode) {
    case 'stake':
      return 'Stake';
    case 'unstake':
      return 'Unstake';
  }
};

const getButtonText = (mode: Mode, walletType: WalletTypes) => {
  if ( walletType === WalletTypes.MetaMask ) {
    return `${getText(mode)} with Alternate Currency`;
  }
  return getText(mode);
};
