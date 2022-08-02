import Image from 'next/image';
import { Button } from 'src/components/buttons/Button';
import { useWallet } from 'src/features/wallet/hooks/useWallet';
import stCELO from 'src/images/icons/stCELO.svg';
import styles from './connect.module.css';

const Connect = () => {
  const { connectWallet } = useWallet();
  return (
    <div className="w-full md:w-1/3 mx-auto self-center md:rounded-xl">
      <div className={styles.connectHeader}>
        <Image src={stCELO} alt="stCelo logo" quality={100} width={136} height={136} />
      </div>
      <div className="p-8">
        <h1 className="text-3xl">Introducing stCELO</h1>

        <ul>
          <li className="text-l font-normal mt-4">Earn a projected 4.56% APY</li>
          <li className="text-l font-normal mt-0.5">Stake without locking</li>
          <li className="text-l font-normal mt-0.5">No fees for launch</li>
        </ul>

        <Button
          classes={`
            w-full h-14
            mt-9 mb-14 md:mb-2
            text-contrast
            bg-action-primary-regular hover:bg-action-primary-dark active:bg-action-primary-light disabled:bg-action-primary-light
          `}
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default Connect;
