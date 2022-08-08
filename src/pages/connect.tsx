import { Button } from 'src/components/buttons/Button';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { useWallet } from 'src/features/wallet/hooks/useWallet';
import styles from './connect.module.css';

const Connect = () => {
  const { connectWallet } = useWallet();
  return (
    <div className="inline-flex w-full sm:pt-[0] sm:pb-[80px] mt-[-80px] sm:mt-0">
      <div className="w-full sm:max-w-[480px] mx-auto self-center sm:rounded-[16px] overflow-hidden">
        <div className={styles.connectHeader}>
          <TokenIcon token="stCELO" quality={100} width={136} height={136} />
        </div>
        <div className="p-[32px] sm:bg-secondary">
          <h1 className="text-[27px] leading-[40px] font-medium mb-[16px]">Introducing stCELO</h1>
          <ul className="text-[18px] leading-[28px] mb-[32px]">
            <li className="mb-[4px]">Earn a projected 4.56% APY</li>
            <li className="mb-[4px]">Stake without locking</li>
            <li>No fees for launch</li>
          </ul>
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
        </div>
      </div>
    </div>
  );
};

export default Connect;
