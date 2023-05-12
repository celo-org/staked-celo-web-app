import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import styles from './connect.module.css';

const Connect = () => {
  const { annualProjectedRate } = useProtocolContext();

  return (
    <div className="inline-flex w-full sm:pt-[0] sm:pb-[80px] mt-[-80px] sm:mt-0">
      <div className="w-full sm:max-w-[480px] mx-auto self-center sm:rounded-[16px] overflow-hidden">
        <div className={styles.connectHeader}>
          <TokenIcon token="stCELO" quality={100} width={136} height={136} />
        </div>
        <div className="p-[32px] sm:bg-secondary">
          <h1 className="text-[27px] leading-[40px] font-medium mb-[16px]">Introducing stCELO</h1>
          <ul className="text-[18px] leading-[28px] mb-[32px]">
            <li className="mb-[4px]">
              Earn a projected {annualProjectedRate ? annualProjectedRate : '-'}% APR
            </li>
            <li className="mb-[4px]">Stake without locking</li>
            <li>No fees for launch</li>
          </ul>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Connect;
