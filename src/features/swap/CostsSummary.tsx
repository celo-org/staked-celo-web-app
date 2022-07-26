import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { Cost } from 'src/features/swap/types';
import { freeValue, useCosts } from 'src/features/swap/useCosts';

interface CostsSummaryProps {
  estimateGasFee: (amount: number) => Promise<BigNumber>;
  exchangeRate: number;
  amount: number;
}

export const CostsSummary = (props: CostsSummaryProps) => {
  const { estimateGasFee, exchangeRate, amount } = props;
  const { costs } = useCosts(amount, exchangeRate, estimateGasFee);

  return (
    <ul className="c-costs-summary mx-2 mt-5">
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
    <li key={cost.title} className="flex justify-between my-2 font-light">
      <span className="flex">
        {cost.title}
        <span className="flex align-middle ml-2">
          <ThemedIcon
            classes="cursor-pointer"
            name="info"
            alt={`${cost.title} cost info`}
            height={20}
            width={20}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span className={cost.value === freeValue ? 'c-costs-summary__free-value font-medium' : ''}>
        {cost.value}
      </span>
      <InfoModal title={cost.title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {cost.tooltip.content}
      </InfoModal>
    </li>
  );
};
