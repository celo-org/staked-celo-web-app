import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { freePriceValue, InfoItem } from 'src/features/swap/utils/transactionInfo';

interface TransactionInfoProps {
  info: InfoItem[];
}

export const TransactionInfo = ({ info }: TransactionInfoProps) => {
  return (
    <ul className="text-secondary mx-2 mt-5">
      {info.map((infoItem) => (
        <InfoItem infoItem={infoItem} key={infoItem.title} />
      ))}
    </ul>
  );
};

interface InfoItemProps {
  infoItem: InfoItem;
}

const InfoItem = ({ infoItem }: InfoItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={infoItem.title} className="flex justify-between my-2 font-light">
      <span className="flex">
        {infoItem.title}
        <span className="flex align-middle ml-2">
          <ThemedIcon
            classes="cursor-pointer"
            name="info"
            alt={`${infoItem.title} cost info`}
            height={20}
            width={20}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span className={infoItem.value === freePriceValue ? 'text-primary-info font-medium' : ''}>
        {infoItem.value}
      </span>
      <InfoModal title={infoItem.title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {infoItem.tooltip.content}
      </InfoModal>
    </li>
  );
};
