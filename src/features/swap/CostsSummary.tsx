import BigNumber from 'bignumber.js';
import Image from 'next/image';
import { useState } from 'react';
import { InfoModal } from 'src/components/modals/InfoModal';
import { Cost } from 'src/features/swap/types';
import { useCosts } from 'src/features/swap/useCosts';
import Info from 'src/images/icons/info.svg';

interface CostsSummaryProps {
  estimateGasFee: (amount: number) => Promise<BigNumber>;
  exchangeRate: number;
  amount: number;
}

export const CostsSummary = (props: CostsSummaryProps) => {
  const { estimateGasFee, exchangeRate, amount } = props;
  const { costs } = useCosts(amount, exchangeRate, estimateGasFee);

  return (
    <ul className="mx-2 mt-5">
      {costs.map((cost) => (
        <CostItem cost={cost} key={cost.title} />
      ))}
    </ul>
  );
};

interface CostItemProps {
  cost: Cost;
}

const CostItem = (props: CostItemProps) => {
  const { cost } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={cost.title} className="flex justify-between my-2 text-gray-400">
      <span className="flex">
        {cost.title}
        <span className="flex align-middle ml-2">
          <Image
            className="cursor-pointer"
            src={Info}
            alt={`${cost.title} cost info`}
            height={20}
            width={20}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span className={cost.title === 'Fees' ? 'text-green' : ''}>{cost.value}</span>
      <InfoModal title={cost.title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {cost.tooltip.content}
      </InfoModal>
    </li>
  );
};
