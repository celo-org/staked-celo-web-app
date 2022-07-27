import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TokenCard } from 'src/features/swap/TokenCard';
import { StakeToken } from 'src/features/swap/types';

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
        <ThemedIcon
          name="receive_info"
          classes="cursor-pointer"
          alt="Unstaking period info"
          height={20}
          width={20}
          onClick={() => setIsOpen(true)}
        />
      </span>
      <InfoModal title="Unstaking period" isOpen={isOpen} close={() => setIsOpen(false)}>
        Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by
        the Celo protocol.
      </InfoModal>
    </>
  );
};

const getInfoChild = (token: StakeToken) => {
  if (token === 'stCELO') {
    return <span className="themed:receive-summary__stake-info">4.56% projected APY</span>;
  } else if (token === 'CELO') {
    return (
      <div className="flex">
        <span className="themed:receive-summary__unstake-info">3-day unlock period</span>
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
      classes="themed:receive-summary w-full mt-6"
      token={token}
      titleChild="Receive"
      inputChild={displayValue}
      infoChild={getInfoChild(token)}
    />
  );
};
