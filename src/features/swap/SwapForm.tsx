import BigNumber from 'bignumber.js';
import { Field, Form, Formik, FormikErrors, useFormikContext } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { CostsSummary } from 'src/features/swap/CostsSummary';
import { TokenCard } from 'src/features/swap/FormTemplate';
import { ReceiveSummary } from 'src/features/swap/ReceiveSummary';
import { fromWeiRounded } from 'src/formatters/amount';
import Arrow from 'src/images/icons/arrow.svg';
import { CeloWei, StCeloWei } from 'src/types/units';
import { BalanceTools } from './BalanceTools';
import { SubmitButton } from './SubmitButton';
import { StakeToken, SwapFormValues } from './types';
import { useCosts } from './useCosts';
import { useFormValidator } from './useFormValidator';

const initialValues: SwapFormValues = {
  amount: '' as unknown as number,
};

interface SwapFormProps {
  onSubmit: (values: SwapFormValues) => void;
  balance: CeloWei | StCeloWei;
  exchangeRate: number;
  fromToken: StakeToken;
  toToken: StakeToken;
  estimateReceiveValue: (num: number) => number;
  estimateGasFee: (amount: number) => Promise<BigNumber>;
}

export const SwapForm = (props: SwapFormProps) => {
  const {
    onSubmit,
    balance,
    exchangeRate,
    fromToken,
    toToken,
    estimateReceiveValue,
    estimateGasFee,
  } = props;
  const [amount, setAmount] = useState<number | undefined>(0);
  const { costs } = useCosts(amount, exchangeRate, estimateGasFee);
  const validateForm = useFormValidator(balance, fromToken);

  return (
    <Formik<SwapFormValues>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange
      validateOnBlur={false}
    >
      {({ isValid }) => (
        <Form className="w-full justify-center items-center text-white">
          <FloatingBox
            width="w-full"
            classes="overflow-visible bg-gray-800 flex flex-col justify-center items-center"
          >
            <SwapFormInput balance={balance} onChange={setAmount} token={fromToken} />
            <Link href="/unstake">
              <a className="absolute">
                <Image src={Arrow} alt="Arrow" width={40} height={40} quality={100} />
              </a>
            </Link>
            <ReceiveSummary
              estimateReceiveValue={estimateReceiveValue}
              amount={amount}
              isValid={isValid}
              token={toToken}
            />
          </FloatingBox>

          <div className="flex justify-center mt-5 mb-1">
            <SubmitButton color="purple" toToken={toToken} />
          </div>

          {!!amount && <CostsSummary costs={costs} />}
        </Form>
      )}
    </Formik>
  );
};

interface FormInputProps {
  onChange: (amount: number | undefined) => void;
  balance: CeloWei | StCeloWei;
  token: StakeToken;
}

const getTitle = (errors: FormikErrors<SwapFormValues>, fromToken: StakeToken) => {
  if (errors.amount) {
    return <span className="text-red">{errors.amount}</span>;
  }

  if (fromToken === 'stCELO') {
    return 'Unstake';
  }

  if (fromToken === 'CELO') {
    return 'Stake';
  }

  return '';
};

const SwapFormInput = (props: FormInputProps) => {
  const { token, balance, onChange } = props;
  const { values, setFieldValue, errors } = useFormikContext<SwapFormValues>();
  const roundedBalance = fromWeiRounded(balance);

  useEffect(() => onChange(values.amount), [onChange, values.amount]);

  const onClickUseMax = () => () => {
    setFieldValue('amount', roundedBalance);
  };

  return (
    <TokenCard
      classes="w-full	bg-gray-900"
      token={token}
      titleChild={getTitle(errors, token)}
      inputChild={
        <Field
          id="amount"
          name="amount"
          type="number"
          placeholder="0.00"
          className={`mr-auto bg-transparent text-left focus:outline-none ${
            errors.amount ? 'text-red' : ''
          }`}
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} roundedBalance={roundedBalance} />}
    />
  );
};
