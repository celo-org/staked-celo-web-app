import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { Token } from 'src/utils/tokens';
import { Mode } from '../types';
import { TokenCard } from './TokenCard';

interface ReceiveSummaryProps {
  mode: Mode;
  value: Token;
}

export const ReceiveSummary = ({ mode, value }: ReceiveSummaryProps) => {
  const displayValue = value.isEqualTo(0) ? '0.00' : value.format();

  return (
    <TokenCard
      classes="pt-[32px]"
      token={mode === 'stake' ? 'stCELO' : 'CELO'}
      titleChild="Receive"
      inputChild={displayValue}
      infoChild={
        <OpacityTransition id={mode} classes="w-full">
          <span>
            <ReceiveInfo mode={mode} />
          </span>
        </OpacityTransition>
      }
    />
  );
};

interface ReceiveInfoProps {
  mode: Mode;
}

const ReceiveInfo = ({ mode }: ReceiveInfoProps) => {
  const { annualProjectedYield } = useProtocolContext();

  switch (mode) {
    case 'stake':
      return (
        <span className="text-color-primary-callout font-medium text-[15px] leading-[20px]">
          {annualProjectedYield ? `${annualProjectedYield}%` : '-'} projected APY
        </span>
      );
    case 'unstake':
      return (
        <div className="inline-flex items-center text-color-secondary-callout">
          <span className="font-medium text-[15px] leading-[20px]">3-day unstake period</span>
          <UnstakeInfo />
        </div>
      );
  }
};

const UnstakeInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span className="flex items-center ml-[6px]">
        <ThemedIcon
          name="receive_info"
          classes="cursor-pointer"
          alt="Unstaking period info"
          height={16}
          width={16}
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
