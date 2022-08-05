import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { Detail, freePriceValue } from 'src/features/swap/utils/details';

interface DetailsProps {
  details: Detail[];
}

export const Details = ({ details }: DetailsProps) => {
  return (
    <ul className="text-secondary mx-2 mt-5">
      {details.map((detail) => (
        <Detail detail={detail} key={detail.title} />
      ))}
    </ul>
  );
};

interface DetailProps {
  detail: Detail;
}

const Detail = ({ detail }: DetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={detail.title} className="flex justify-between my-2 font-light">
      <span className="flex">
        {detail.title}
        <span className="flex align-middle ml-2">
          <ThemedIcon
            classes="cursor-pointer"
            name="info"
            alt={`${detail.title} cost info`}
            height={20}
            width={20}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span className={detail.value === freePriceValue ? 'text-primary-info font-medium' : ''}>
        {detail.value}
      </span>
      <InfoModal title={detail.title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {detail.tooltip.content}
      </InfoModal>
    </li>
  );
};