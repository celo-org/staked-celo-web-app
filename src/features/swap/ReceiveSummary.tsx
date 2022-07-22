import Image from 'next/image';
import { useState } from 'react';
import { Modal } from 'src/components/modals/Modal';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TokenCard } from 'src/features/swap/TokenCard';
import { StakeToken } from 'src/features/swap/types';
import Info from 'src/images/icons/info.svg';

interface ReceiveSummaryProps {
  amount: number | undefined;
  token: StakeToken;
  estimateReceiveValue: (num: number) => number;
  isValid: boolean;
}

const UnstakeInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span className="flex ml-2">
        <Image
          className="cursor-pointer"
          src={Info}
          alt="Unstaking period info"
          height={20}
          width={20}
          onClick={() => setIsOpen(true)}
        />
      </span>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by
        the Celo protocol.
      </Modal>
    </>
  );
};

const getInfoChild = (token: StakeToken) => {
  if (token === 'stCELO') {
    return <span className="text-pear">4.56% projected APY</span>;
  } else if (token === 'CELO') {
    return (
      <div className="flex">
        <span className="text-green">3-day unlock period</span>
        <UnstakeInfo />
      </div>
    );
  }

  return;
};

export const ReceiveSummary = ({
  amount,
  token,
  estimateReceiveValue,
  isValid,
}: ReceiveSummaryProps) => {
  const estimatedValue = amount && isValid && estimateReceiveValue(amount);
  const displayValue = estimatedValue ? estimatedValue.toFixed(DISPLAY_DECIMALS) : '0.00';

  return (
    <TokenCard
      classes="w-full"
      token={token}
      titleChild="Receive"
      inputChild={displayValue}
      infoChild={getInfoChild(token)}
    />
  );
};
