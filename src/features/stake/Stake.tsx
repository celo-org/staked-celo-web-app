import BigNumber from 'bignumber.js';
import { Field, Form, Formik, useFormikContext } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { FeesSummary } from 'src/features/stake/FeesSummary';
import { TokenCard } from 'src/features/stake/FormTemplate';
import { ReceiveSummary } from 'src/features/stake/ReceiveSummary';
import { fromWei, fromWeiRounded } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import Arrow from 'src/images/icons/arrow.svg';
import { BalanceTools } from './BalanceTools';
import { SubmitButton } from './SubmitButton';
import { StakeFormValues } from './types';
import { useFormValidator } from './useFormValidator';

const initialValues: StakeFormValues = {
  amount: '' as unknown as number,
};

const fees = [
  {
    title: 'Exchange Rate',
    value: 1.03,
    tooltip: {
      content:
        'stCELO’s exchange rate continuously accrues value vs CELO. As you receive rewards, your amount of stCELO will not change but when you unstake it will be worth more CELO than what you paid.',
    },
  },
  {
    title: 'Transaction Cost',
    value: '< $0.01',
    tooltip: {
      content:
        'Every blockchain transaction requires gas fees to be paid. The amount mentioned is an estimate of these gas costs.',
    },
  },
  {
    title: 'Fees',
    value: 'Free',
    tooltip: {
      content: 'For the launch of the stCELO protocol, fees are free.',
    },
  },
];

export const Stake = () => {
  const onSubmit = (values: StakeFormValues) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <div className="flex justify-center md:w-96 mx-auto">
      <StakeForm onSubmit={onSubmit} />
    </div>
  );
};

interface StakeFormProps {
  onSubmit: (values: StakeFormValues) => void;
}

export const StakeForm = ({ onSubmit }: StakeFormProps) => {
  const [amount, setAmount] = useState<number | undefined>(0);
  const { address, celoBalance } = useAccount();
  const validateForm = useFormValidator();

  return (
    <Formik<StakeFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <Form className="w-full justify-center items-center text-white">
        <FloatingBox
          width="w-full"
          classes="overflow-visible bg-gray-800 flex flex-col justify-center items-center"
        >
          <StakeFormInput balance={celoBalance} onChange={setAmount} />
          <Link href="/unstake">
            <a className="absolute">
              <Image src={Arrow} alt="Arrow" width={40} height={40} quality={100} />
            </a>
          </Link>
          <ReceiveSummary amount={amount} />
        </FloatingBox>

        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton color={'purple'} address={address} />
        </div>

        <FeesSummary fees={fees} />
      </Form>
    </Formik>
  );
};

interface FormInputProps {
  balance: BigNumber;
  onChange: (amount: number | undefined) => void;
}

const StakeFormInput = (props: FormInputProps) => {
  const { balance, onChange } = props;
  const { values, setFieldValue } = useFormikContext<StakeFormValues>();
  const roundedBalance = fromWeiRounded(fromWei(balance));

  useEffect(() => onChange(values.amount), [onChange, values.amount]);

  const onClickUseMax = () => () => {
    setFieldValue('amount', roundedBalance);
  };

  return (
    <TokenCard
      classes="w-full	bg-gray-900"
      token="CELO"
      titleChild="Stake"
      inputChild={
        <Field
          id="amount"
          name="amount"
          type="number"
          step="any"
          placeholder="0.00"
          className="mr-auto bg-transparent text-left focus:outline-none"
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} roundedBalance={roundedBalance} />}
    />
  );
};
