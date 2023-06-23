import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { InfoModal } from 'src/components/modals/InfoModal';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { Mode } from 'src/types';
import { CeloUSD } from 'src/utils/tokens';

interface DetailsProps {
  mode: Mode;
  swapRate: number;
  gasFee: CeloUSD;
}

export const Details = ({ mode, swapRate, gasFee }: DetailsProps) => {
  const details = getDetails(mode, swapRate, gasFee);

  return (
    <ul className="text-color-secondary mt-[24px] text-[15px] leading-[24px]">
      {details.map((detail) => (
        <Detail key={detail.title} {...detail} />
      ))}
    </ul>
  );
};

const getDetails = (mode: Mode, swapRate: number, gasFee: CeloUSD) => {
  switch (mode) {
    case Mode.unstake:
      return [exchangeDetail(swapRate), gasDetail(gasFee), feeDetail];
    default:
    case Mode.stake:
      return [exchangeDetail(swapRate), gasDetail(gasFee), feeDetail, periodDetail];
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
        {value === freePriceValue ? <FreePriceValue /> : value}
      </span>
      <InfoModal title={title} isOpen={isOpen} close={() => setIsOpen(false)}>
        {tooltip}
      </InfoModal>
    </li>
  );
};

const freePriceValue = 'Free*';

const FreePriceValue = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span className="inline-flex items-center">
        <span>Free</span>
        <span className="flex items-center ml-[8px]">
          <ThemedIcon
            classes="cursor-pointer"
            name="receive_info"
            alt={`Free info`}
            height={16}
            width={16}
            onClick={() => setIsOpen(true)}
          />
        </span>
      </span>

      <InfoModal title="What does free mean ?" isOpen={isOpen} close={() => setIsOpen(false)}>
        All the epoch rewards accrued by the underlying CELO are shared with stCELO holders and the
        StakedCelo protocol is earning no fees. Blockchain transaction fees and/or other fees may
        apply.
      </InfoModal>
    </>
  );
};

const exchangeDetail = (swapRate: number): DetailProps => ({
  title: 'Exchange Rate',
  value: swapRate ? swapRate.toFixed(DISPLAY_DECIMALS) : '...',
  tooltip:
    'stCELO’s exchange rate continuously accrues value vs CELO. As you receive rewards, your amount of stCELO will not change but when you unstake it will be worth more CELO than what you paid.',
});

const gasDetail = (gasFee: CeloUSD): DetailProps => {
  const value = gasFee.convertToBase().isLessThan(0.001)
    ? '< $0.001'
    : `~$${gasFee.convertToBase().toFixed()}`;
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
