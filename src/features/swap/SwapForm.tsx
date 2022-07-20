import { Field, Form, Formik, useFormikContext } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { useCosts } from 'src/features/stake/useCosts';
import { CostsSummary } from 'src/features/swap/CostsSummary';
import { TokenCard } from 'src/features/swap/FormTemplate';
import { ReceiveSummary } from 'src/features/swap/ReceiveSummary';
import { fromWeiRounded } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import Arrow from 'src/images/icons/arrow.svg';
import { CeloWei, StakedCeloWei } from 'src/types/units';
import { BalanceTools } from './BalanceTools';
import { SubmitButton } from './SubmitButton';
import { StakeToken, SwapFormValues } from './types';
import { useFormValidator } from './useFormValidator';

const initialValues: SwapFormValues = {
  amount: '' as unknown as number,
};

interface SwapFormProps {
  onSubmit: (values: SwapFormValues) => void;
  balance: CeloWei | StakedCeloWei;
  fromToken: StakeToken;
  toToken: StakeToken;
}

export const SwapForm = (props: SwapFormProps) => {
  const { onSubmit, balance, fromToken, toToken } = props;
  const [amount, setAmount] = useState<number | undefined>(0);
  const { address } = useAccount();
  const { costs } = useCosts(amount);
  const validateForm = useFormValidator(balance);

  return (
    <Formik<SwapFormValues>
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
          <SwapFormInput balance={balance} onChange={setAmount} token={fromToken} />
          <Link href="/unstake">
            <a className="absolute">
              <Image src={Arrow} alt="Arrow" width={40} height={40} quality={100} />
            </a>
          </Link>
          <ReceiveSummary amount={amount} token={toToken} />
        </FloatingBox>

        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton color="purple" address={address || ''} />
        </div>

        <CostsSummary costs={costs} />
      </Form>
    </Formik>
  );
};

interface FormInputProps {
  onChange: (amount: number | undefined) => void;
  balance: CeloWei | StakedCeloWei;
  token: StakeToken;
}

const SwapFormInput = (props: FormInputProps) => {
  const { token, balance, onChange } = props;
  const { values, setFieldValue } = useFormikContext<SwapFormValues>();
  const roundedBalance = fromWeiRounded(balance);

  useEffect(() => onChange(values.amount), [onChange, values.amount]);

  const onClickUseMax = () => () => {
    setFieldValue('amount', roundedBalance);
  };

  return (
    <TokenCard
      classes="w-full	bg-gray-900"
      token={token}
      titleChild="Stake"
      inputChild={
        <Field
          id="amount"
          name="amount"
          type="number"
          placeholder="0.00"
          className="mr-auto bg-transparent text-left focus:outline-none"
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} roundedBalance={roundedBalance} />}
    />
  );
};
