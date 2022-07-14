import BigNumber from 'bignumber.js';
import { Field, Form, Formik, useFormikContext } from 'formik';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { fromWei, fromWeiRounded } from 'src/formatters/amount';
import { useAccount } from 'src/hooks/useAccount';
import CeloDark from 'src/images/icons/celo-dark.svg';
import { BalanceTools } from './BalanceTools';
import { SubmitButton } from './SubmitButton';
import { StakeFormValues } from './types';
import { useEstimations } from './useEstimations';
import { useFormValidator } from './useFormValidator';

const initialValues: StakeFormValues = {
  amount: undefined,
};

export const StakeForm = () => {
  const onSubmit = (values: StakeFormValues) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <div className="flex justify-center">
      <StakeFormInner onSubmit={onSubmit} />
    </div>
  );
};

interface StakeFormInnerProps {
  onSubmit: (values: StakeFormValues) => void;
}

export function StakeFormInner({ onSubmit }: StakeFormInnerProps) {
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
        <FloatingBox width="w-96" classes="overflow-visible">
          <StakeFormInputs balance={celoBalance} />
        </FloatingBox>

        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton address={address} />
        </div>
      </Form>
    </Formik>
  );
}

interface FormInputProps {
  balance: BigNumber;
}

function StakeFormInputs(props: FormInputProps) {
  const { balance } = props;
  const { values, setFieldValue } = useFormikContext<StakeFormValues>();
  const { estDepositValue } = useEstimations();
  const value = values.amount && estDepositValue(values.amount);
  const estimatedRate: number = estDepositValue(1);
  const roundedBalance = fromWeiRounded(fromWei(balance));

  const onClickUseDecimalFraction = (decimalFraction: number) => () => {
    setFieldValue('amount', roundedBalance * decimalFraction);

    if (decimalFraction === 1) {
      toast.warn('Consider keeping some CELO for transaction fees');
    }
  };

  return (
    <div className="relative">
      <h2 className="text-lg font-medium">Stake</h2>
      <div className="flex flex-col space-between mb-4">
        <div className="flex flex-row items-center">
          <Image src={CeloDark} alt="CELO Logo" quality={100} width={32} height={32} />
          <span className="ml-3">CELO</span>
          <Field
            id="amount"
            name="amount"
            type="number"
            step="any"
            placeholder="0.00"
            className="ml-auto bg-transparent text-right text-xl font-mono focus:outline-none"
          />
        </div>
        <BalanceTools
          onClickUseDecimalFraction={onClickUseDecimalFraction}
          roundedBalance={roundedBalance}
        />
      </div>
      <h2 className="text-lg font-medium">Receive</h2>
      <div className="flex justify-between items-center bg-greengray-lightest rounded-md">
        <Image src={CeloDark} alt="CELO Logo" quality={100} width={32} height={32} />
        <span className="ml-3">stCELO</span>
        <div className="text-xl text-right font-mono ml-auto overflow-hidden">
          {value ? value.toFixed(DISPLAY_DECIMALS) : 0.0}
        </div>
      </div>
      <div className="flex items-center justify-end my-2.5 px-1.5 text-xs text-gray-400">
        {estimatedRate ? `1 stCELO ~ ${estimatedRate} CELO` : 'Loading...'}
      </div>
    </div>
  );
}
