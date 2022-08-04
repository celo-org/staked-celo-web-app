import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { Token, Wei } from 'src/utils/tokens';
import { TokenCard } from './TokenCard';

interface ReceiveSummaryProps<SourceWei extends Wei> {
  token: Token;
  value: SourceWei;
}

const UnstakeInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span className="flex ml-[6px]">
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

const getInfoChild = (token: Token) => {
  if (token === 'stCELO') {
    return (
      <span className="text-primary-info font-medium text-[15px] leading-[24px]">
        4.56% projected APY
      </span>
    );
  } else if (token === 'CELO') {
    return (
      <div className="flex">
        <span className="text-secondary-info font-medium text-[15px] leading-[24px]">
          3-day unstake period
        </span>
        <UnstakeInfo />
      </div>
    );
  }

  return;
};

export const ReceiveSummary = <SourceWei extends Wei>({
  token,
  value,
}: ReceiveSummaryProps<SourceWei>) => {
  const displayValue = value.isEqualTo(0) ? '0.00' : value.display();

  return (
    <TokenCard
      classes="pt-[32px]"
      token={token}
      titleChild="Receive"
      inputChild={displayValue}
      infoChild={getInfoChild(token)}
    />
  );
};
