import Image from 'next/image';
import { useState } from 'react';
import { Modal } from 'src/components/modals/Modal';
import { Fee } from 'src/features/stake/types';
import Info from 'src/images/icons/info.svg';

interface FeesSummaryProps {
  fees: Fee[];
}

export const FeesSummary = (props: FeesSummaryProps) => (
  <ul className="mx-2 mt-5">
    {props.fees.map((fee) => (
      <FeeItem fee={fee} key={fee.title} />
    ))}
  </ul>
);

interface FeeItemProps {
  fee: Fee;
}

const FeeItem = (props: FeeItemProps) => {
  const { fee } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={fee.title} className="flex justify-between my-2 text-gray-400">
      <span className="flex">
        {fee.title}
        <span className="flex align-middle ml-2">
          <Image
            className="cursor-pointer"
            src={Info}
            alt={`${fee.title} fee info`}
            height={20}
            width={20}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span className={fee.value === 'Free' ? 'text-green' : ''}>{fee.value}</span>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        {fee.tooltip.content}
      </Modal>
    </li>
  );
};
