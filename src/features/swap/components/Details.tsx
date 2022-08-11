import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { Token } from 'src/utils/tokens';
import { Mode } from '../types';

interface DetailsProps {
  mode: Mode;
  exchangeRate: number;
  gasFee: Token;
}

export const Details = ({ mode, exchangeRate, gasFee }: DetailsProps) => {
  const details = getDetails(mode, exchangeRate, gasFee);

  return (
    <ul className="text-color-secondary mt-[24px] text-[15px] leading-[24px]">
      {details.map((detail) => (
        <Detail key={detail.title} {...detail} />
      ))}
    </ul>
  );
};

const getDetails = (mode: Mode, exchangeRate: number, gasFee: Token) => {
  switch (mode) {
    case 'unstake':
      return [exchangeDetail(exchangeRate), gasDetail(gasFee), feeDetail];
    case 'stake':
      return [exchangeDetail(exchangeRate), gasDetail(gasFee), feeDetail, periodDetail];
  }
};

interface DetailProps {
  title: string;
  value: string;
  tooltip: string;
}

const Detail = ({ title, value, tooltip }: DetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={title} className="flex justify-between font-normal mb-[4px]">
      <span className="inline-flex items-center">
        <span className="text-[15px] leading-[24px]">{title}</span>
        <span className="inline flex items-center ml-[8px]">
          <ThemedIcon
            classes="cursor-pointer"
            name="info"
            alt={`${title} cost info`}
            height={16}
            width={16}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>
      <span className={value === freePriceValue ? 'text-color-tertiary-callout font-medium' : ''}>
        {value}
      </span>
      <InfoModal title={title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {tooltip}
      </InfoModal>
    </li>
  );
};

const freePriceValue = 'Free*';

const exchangeDetail = (exchangeRate: number): DetailProps => ({
  title: 'Exchange Rate',
  value: exchangeRate ? exchangeRate.toFixed(DISPLAY_DECIMALS) : '...',
  tooltip:
    'stCELO’s exchange rate continuously accrues value vs CELO. As you receive rewards, your amount of stCELO will not change but when you unstake it will be worth more CELO than what you paid.',
});

const gasDetail = (gasFee: Token): DetailProps => {
  const value = gasFee.convertToBase().isLessThan(0.001) ? '< 0.001' : `~${gasFee.toFixed()}`;
  return {
    title: 'Transaction Cost',
    value: value || '...',
    tooltip:
      'Every blockchain transaction requires gas fees to be paid. The amount mentioned is an estimate of these gas costs.',
  };
};

const feeDetail: DetailProps = {
  title: 'Fees',
  value: freePriceValue,
  tooltip: 'For the launch of the stCELO protocol, fees are free.',
};

const periodDetail: DetailProps = {
  title: 'Unstake period',
  value: '3 days',
  tooltip:
    'Unlocking staked Celo for withdrawal requires a three day waiting period, a timeframe set by the Celo protocol.',
};
