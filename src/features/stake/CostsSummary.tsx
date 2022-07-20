import Image from 'next/image';
import { useState } from 'react';
import { Modal } from 'src/components/modals/Modal';
import { Cost } from 'src/features/stake/types';
import Info from 'src/images/icons/info.svg';

interface CostsSummaryProps {
  costs: Cost[];
}

export const CostsSummary = (props: CostsSummaryProps) => (
  <ul className="mx-2 mt-5">
    {props.costs.map((cost) => (
      <CostItem cost={cost} key={cost.title} />
    ))}
  </ul>
);

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
      <span className={cost.value === 'Free' ? 'text-green' : ''}>{cost.value}</span>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        {cost.tooltip.content}
      </Modal>
    </li>
  );
};
