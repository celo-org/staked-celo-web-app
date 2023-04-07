import { Button } from 'src/components/buttons/Button';
import { useWallet } from 'src/features/wallet/hooks/useWallet';

export const ConnectButton = () => {
  const { connectWallet } = useWallet();
  return (
    <Button
      classes={`
              w-full
              text-color-contrast
              bg-action-primary-regular hover:bg-action-primary-dark active:bg-action-primary-light disabled:bg-action-primary-light
            `}
      onClick={connectWallet}
    >
      Connect Wallet
    </Button>
  );
};
