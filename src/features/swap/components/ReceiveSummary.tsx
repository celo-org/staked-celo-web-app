import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { Token } from 'src/utils/tokens';
import { Mode } from '../types';
import { TokenCard } from './TokenCard';

interface ReceiveSummaryProps {
  mode: Mode;
  value: Token;
}

const UnstakeInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span className="flex items-center ml-[6px]">
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

const getInfoChild = (mode: Mode) => {
  if (mode === 'stake') {
    return (
      <span className="text-color-primary-info font-medium text-[15px] leading-[20px]">
        4.56% projected APY
      </span>
    );
  } else if (mode === 'unstake') {
    return (
      <div className="inline-flex items-center text-color-secondary-info">
        <span className="font-medium text-[15px] leading-[20px]">3-day unstake period</span>
        <UnstakeInfo />
      </div>
    );
  }

  return;
};

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
          <span>{getInfoChild(mode)}</span>
        </OpacityTransition>
      }
    />
  );
};
