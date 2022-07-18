import BigNumber from 'bignumber.js';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { IconButton } from 'src/components/buttons/IconButton';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TokenCard } from 'src/features/stake/FormTemplate';
import { useEstimations } from 'src/features/stake/useEstimations';
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

export const Swap = () => {
  const onSubmit = (values: StakeFormValues) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <div className="flex justify-center">
      <StakeForm onSubmit={onSubmit} />
    </div>
  );
};

interface StakeFormProps {
  onSubmit: (values: StakeFormValues) => void;
}

export const StakeForm = ({ onSubmit }: StakeFormProps) => {
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
      <Form>
        <FloatingBox width="w-96" classes="overflow-visible bg-gray-light">
          <StakeFormInput balance={celoBalance} />
        </FloatingBox>

        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton color={'purple'} address={address} />
        </div>
      </Form>
    </Formik>
  );
};

interface FormInputProps {
  balance: BigNumber;
}

const StakeFormInput = (props: FormInputProps) => {
  const { balance } = props;
  const { values, setFieldValue } = useFormikContext<StakeFormValues>();
  const roundedBalance = fromWeiRounded(fromWei(balance));

  const onClickUseDecimalFraction = (decimalFraction: number) => () => {
    setFieldValue('amount', roundedBalance * decimalFraction);
  };

  return (
    <div className="flex flex-col justify-center items-center text-white">
      <TokenCard
        classes="w-full	bg-gray-dark"
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
        infoChild={
          <BalanceTools
            onClickUseDecimalFraction={onClickUseDecimalFraction}
            roundedBalance={roundedBalance}
          />
        }
      />
      <IconButton classes="absolute" imgSrc={Arrow} width={40} height={40} />
      <ReceiveSummary amount={values.amount} />
    </div>
  );
};

interface ReceiveSummaryProps {
  amount: number | undefined;
}

export const ReceiveSummary = (props: ReceiveSummaryProps) => {
  const { estDepositValue } = useEstimations();
  const value = props.amount && estDepositValue(props.amount);
  const estimatedRate: number = estDepositValue(1);

  return (
    <TokenCard
      classes="w-full"
      token="stCELO"
      titleChild="Receive"
      inputChild={value ? value.toFixed(DISPLAY_DECIMALS) : 0.0}
      infoChild={estimatedRate ? `1 stCELO ~ ${estimatedRate} CELO` : 'Loading...'}
    />
  );
};
