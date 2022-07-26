import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { FormEventHandler, useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { CostsSummary } from 'src/features/swap/CostsSummary';
import { ReceiveSummary } from 'src/features/swap/ReceiveSummary';
import { TokenCard } from 'src/features/swap/TokenCard';
import { fromWeiRounded } from 'src/formatters/amount';
import { useExchangeContext } from 'src/providers/ExchangeProvider';
import { CeloWei, StCeloWei } from 'src/types/units';
import { BalanceTools } from './BalanceTools';
import { SubmitButton } from './SubmitButton';
import { StakeToken } from './types';
import { useFormValidator } from './useFormValidator';

interface SwapFormProps {
  onSubmit: (amount: number | undefined) => void;
  balance: CeloWei | StCeloWei;
  exchangeRate: number;
  fromToken: StakeToken;
  toToken: StakeToken;
  estimateReceiveValue: (num: number) => number;
  estimateGasFee: (amount: number) => Promise<BigNumber>;
}

const getHref = (toToken: StakeToken) => {
  if (toToken === 'CELO') return '/';
  if (toToken === 'stCELO') return '/unstake';

  return '';
};

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

  const [amount, setAmount] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const isValid = !error;
  const validateForm = useFormValidator(balance, fromToken);
  const { reloadExchangeContext } = useExchangeContext();
  const disabledSubmit = !amount || isLoading || !!error || !isTouched;

  const submit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await onSubmit(amount);
        await reloadExchangeContext();
      } finally {
        setIsLoading(false);
      }
      setAmount(0);
    },
    [amount, onSubmit, reloadExchangeContext]
  );

  const onInputChange = (value: number | undefined) => {
    setIsTouched(true);
    setError(validateForm(value));
    setAmount(value);
  };

  return (
    <form className="c-swap-form w-full justify-center items-center" onSubmit={submit}>
      <FloatingBox
        width="w-full"
        classes="c-swap-form__box overflow-visible flex flex-col justify-center items-center"
      >
        <SwapFormInput
          balance={balance}
          value={amount}
          onChange={onInputChange}
          token={fromToken}
          error={error}
        />
        <Link href={getHref(toToken)}>
          <a className="absolute">
            <ThemedIcon name="arrow" alt="Arrow" width={40} height={40} quality={100} />
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
        <SubmitButton toToken={toToken} disabled={disabledSubmit} pending={isLoading} />
      </div>
      {!!amount && (
        <CostsSummary
          amount={isValid ? amount : 0}
          exchangeRate={exchangeRate}
          estimateGasFee={estimateGasFee}
        />
      )}
    </form>
  );
};

interface FormInputProps {
  onChange: (amount?: number) => void;
  balance: CeloWei | StCeloWei;
  token: StakeToken;
  error?: string;
  value: number | undefined;
}

const getTitle = (error: string | undefined, fromToken: StakeToken) => {
  if (error) {
    return <span className="c-swap-form__error-text">{error}</span>;
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
  const { token, balance, value, onChange } = props;
  const roundedBalance = fromWeiRounded(balance);

  const onClickUseMax = () => () => {
    onChange(roundedBalance);
  };

  const onInputChange = (values: NumberFormatValues) => {
    onChange(values.floatValue);
  };

  return (
    <TokenCard
      classes="c-swap-form__input w-full"
      token={token}
      titleChild={getTitle(props.error, token)}
      inputChild={
        <NumberFormat
          className={`mr-auto bg-transparent text-left focus:outline-none ${
            props.error ? 'c-swap-form__error-text' : ''
          }`}
          placeholder="0.00"
          thousandSeparator
          onValueChange={onInputChange}
          value={value}
          allowNegative={false}
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} roundedBalance={roundedBalance} />}
    />
  );
};
