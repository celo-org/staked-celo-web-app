import Link from 'next/link';
import { FormEventHandler, useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { Token, toWei, Wei } from 'src/utils/tokens';
import { useFormValidator } from '../hooks/useFormValidator';
import { Detail } from '../utils/details';
import { BalanceTools } from './BalanceTools';
import { Details } from './Details';
import { ReceiveSummary } from './ReceiveSummary';
import { SubmitButton } from './SubmitButton';
import { TokenCard } from './TokenCard';

interface SwapFormProps<SourceWei extends Wei, TargetWei extends Wei> {
  onSubmit: () => void;
  onChange: (amount?: Wei) => void;
  balance: SourceWei;
  fromToken: Token;
  toToken: Token;
  receiveValue: TargetWei;
  details: Detail[];
}

const getHref = (toToken: Token) => {
  if (toToken === 'CELO') return '/';
  if (toToken === 'stCELO') return '/unstake';
  return '';
};

export const SwapForm = <SourceWei extends Wei, TargetWei extends Wei>({
  onSubmit,
  onChange,
  balance,
  fromToken,
  toToken,
  receiveValue,
  details,
}: SwapFormProps<SourceWei, TargetWei>) => {
  const [amount, setAmount] = useState<Wei | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const validateForm = useFormValidator(balance, fromToken);
  const { reloadExchangeContext } = useExchangeContext();
  const disabledSubmit = !amount || isLoading || !!error || !isTouched;

  const submit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await onSubmit();
        await reloadExchangeContext();
      } finally {
        setIsLoading(false);
      }
      setAmount(new Wei(0));
    },
    [onSubmit, reloadExchangeContext]
  );

  const onInputChange = (value: Wei | undefined) => {
    setIsTouched(true);
    setError(validateForm(value));
    setAmount(value);
    onChange(value);
  };

  return (
    <form className="w-full justify-center items-center mt-[24px]" onSubmit={submit}>
      <div className="flex flex-col justify-center items-center w-full bg-secondary p-[8px] rounded-[16px]">
        <SwapFormInput
          balance={balance}
          value={amount}
          onChange={onInputChange}
          token={fromToken}
          error={error}
        />
        <Link href={getHref(toToken)}>
          <a className="absolute inline-flex">
            <ThemedIcon name="arrow" alt="Arrow" width={40} height={40} quality={100} />
          </a>
        </Link>
        <ReceiveSummary value={receiveValue} token={toToken} />
      </div>
      <div className="flex justify-center mt-[16px] mb-[24px]">
        <SubmitButton toToken={toToken} disabled={disabledSubmit} pending={isLoading} />
      </div>
      {!!amount && !error && <Details details={details} />}
    </form>
  );
};

interface FormInputProps<SourceWei extends Wei> {
  onChange: (amount?: Wei) => void;
  balance: SourceWei;
  token: Token;
  error?: string;
  value: SourceWei | undefined;
}

const getTitle = (error: string | undefined, fromToken: Token) => {
  if (error) return <span className="text-error">{error}</span>;
  if (fromToken === 'stCELO') return 'Unstake';
  if (fromToken === 'CELO') return 'Stake';
  return '';
};

const SwapFormInput = <SourceWei extends Wei>({
  token,
  balance,
  value,
  onChange,
  error,
}: FormInputProps<SourceWei>) => {
  const onClickUseMax = () => (balance.display() !== value?.display() ? onChange(balance) : null);
  const onInputChange = (values: NumberFormatValues) =>
    onChange(values.value ? toWei(values.value) : undefined);

  return (
    <TokenCard
      classes="bg-tertiary rounded-t-[16px] pb-[32px]"
      token={token}
      titleChild={getTitle(error, token)}
      inputChild={
        <NumberFormat
          className={`focus:outline-none bg-transparent placeholder-primary ${
            error ? 'text-error' : ''
          } ${value === undefined ? 'text-secondary' : ''}`}
          placeholder="0.00"
          thousandSeparator
          onValueChange={onInputChange}
          value={value ? parseFloat(value.display()) : undefined}
          allowNegative={false}
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} balance={balance} />}
    />
  );
};
