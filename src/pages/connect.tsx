import Image from 'next/image';
import { SolidButton } from 'src/components/buttons/SolidButton';
import { useWallet } from 'src/features/wallet/useWallet';
import stCELO from 'src/images/icons/stCELO.svg';
import styles from './connect.module.css';

const Connect = () => {
  const { connectWallet } = useWallet();
  return (
    <div className="w-full md:w-1/3 md:bg-gray-800 mx-auto self-center md:rounded-xl">
      <div className={styles.connectHeader}>
        <Image src={stCELO} alt="Celo logo" quality={100} width={136} height={136} />
      </div>
      <div className="p-8">
        <h1 className="text-3xl font-semibold text-white">Introducing stCELO</h1>

        <ul className="text-gray-100">
          <li className="text-l font-normal mt-4">Earn a projected 4.56% APY</li>
          <li className="text-l font-normal">Stake without locking</li>
          <li className="text-l font-normal">No fees for launch</li>
        </ul>

        <SolidButton
          color="purple"
          classes="text-black w-full h-14 py-9 mt-9 mb-14 md:mb-2"
          onClick={connectWallet}
        >
          Connect Wallet
        </SolidButton>
      </div>
    </div>
  );
};

export default Connect;
