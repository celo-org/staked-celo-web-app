import Image from 'next/image';
import { SolidButton } from 'src/components/buttons/SolidButton';
import { useWallet } from 'src/features/wallet/useWallet';
import stCELO from 'src/images/icons/stCELO.svg';
import styles from './connect.module.css';

const Connect = () => {
  const { connectWallet } = useWallet();
  return (
    <div className="c-welcome w-full md:w-1/3 mx-auto self-center md:rounded-xl">
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

        <SolidButton
          classes="c-welcome__connect-button w-full h-14 py-9 mt-9 mb-14 md:mb-2"
          onClick={connectWallet}
        >
          Connect Wallet
        </SolidButton>
      </div>
    </div>
  );
};

export default Connect;
