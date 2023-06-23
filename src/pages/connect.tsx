import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { TokenIcon } from 'src/components/icons/TokenIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import styles from './connect.module.css';

const Connect = () => {
  const { annualProjectedRate } = useProtocolContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-flex w-full sm:pt-[0] sm:pb-[80px] mt-[-80px] sm:mt-0">
      <div className="w-full sm:max-w-[480px] mx-auto self-center sm:rounded-[16px] overflow-hidden">
        <div className={styles.connectHeader}>
          <TokenIcon token="stCELO" quality={100} width={136} height={136} />
        </div>
        <div className="p-[32px] sm:bg-secondary">
          <h1 className="text-[27px] leading-[40px] font-medium mb-[16px]">Introducing stCELO</h1>
          <ul className="text-[18px] leading-[28px] mb-[32px]">
            <li className="mb-[4px]">Continue to earn rewards while using Celo</li>
            <li className="mb-[4px]">Stake without locking</li>
            <li></li>
            <span className="inline-flex items-center">
              <span>No fees for launch</span>
              <span className="flex items-center ml-[8px]">
                <ThemedIcon
                  classes="cursor-pointer"
                  name="info"
                  alt={`No fees for launch info`}
                  height={16}
                  width={16}
                  onClick={() => setIsOpen(true)}
                />
              </span>
            </span>
          </ul>
          <ConnectButton />
        </div>
      </div>
      <InfoModal title="What does no fees mean?" isOpen={isOpen} close={() => setIsOpen(false)}>
        All the epoch rewards accrued by the underlying CELO are shared with stCELO holders and the
        StakedCelo protocol is earning no fees. Blockchain transaction fees and/or other fees may
        apply.
      </InfoModal>
    </div>
  );
};

export default Connect;
