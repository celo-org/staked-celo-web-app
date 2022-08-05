import Link from 'next/link';
import { FormEventHandler, useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { Token, toToken } from 'src/utils/tokens';
import { useFormValidator } from '../hooks/useFormValidator';
import { Mode } from '../types';
import { Detail } from '../utils/details';
import { BalanceTools } from './BalanceTools';
import { Details } from './Details';
import { ReceiveSummary } from './ReceiveSummary';
import { SubmitButton } from './SubmitButton';
import { TokenCard } from './TokenCard';

interface SwapFormProps {
  amount: Token | null;
  onSubmit: () => void;
  onChange: (amount?: Token) => void;
  balance: Token;
  mode: Mode;
  receiveValue: Token;
  details: Detail[];
}

const getHref = (mode: Mode) => {
  if (mode === 'stake') return '/';
  if (mode === 'unstake') return '/unstake';
  return '';
};

export const SwapForm = ({
  amount,
  onSubmit,
  onChange,
  balance,
  mode,
  receiveValue,
  details,
}: SwapFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const validateForm = useFormValidator(balance, mode);
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
    },
    [onSubmit, reloadExchangeContext]
  );

  const onInputChange = (value: Token | undefined) => {
    setIsTouched(true);
    setError(validateForm(value));
    onChange(value);
  };

  return (
    <form className="w-full justify-center items-center mt-[24px]" onSubmit={submit}>
      <div className="flex flex-col justify-center items-center w-full bg-secondary p-[8px] rounded-[16px]">
        <SwapFormInput
          balance={balance}
          amount={amount}
          onChange={onInputChange}
          mode={mode}
          error={error}
        />
        <Link href={getHref(mode)}>
          <a className="absolute inline-flex">
            <ThemedIcon name="arrow" alt="Arrow" width={40} height={40} quality={100} />
          </a>
        </Link>
        <ReceiveSummary value={receiveValue} mode={mode} />
      </div>
      <div className="flex justify-center mt-[16px] mb-[24px]">
        <SubmitButton mode={mode} disabled={disabledSubmit} pending={isLoading} />
      </div>
      {!error && amount?.isGreaterThan(0) && <Details details={details} />}
    </form>
  );
};

interface FormInputProps {
  onChange: (amount?: Token) => void;
  balance: Token;
  mode: Mode;
  error?: string;
  amount: Token | null;
}

const getTitle = (error: string | undefined, mode: Mode) => {
  if (error) return <span className="text-error">{error}</span>;
  if (mode === 'stake') return 'Stake';
  if (mode === 'unstake') return 'Unstake';
  return '';
};

const SwapFormInput = ({ mode, balance, amount, onChange, error }: FormInputProps) => {
  const onClickUseMax = () => (balance.format() !== amount?.format() ? onChange(balance) : null);
  const onInputChange = (values: NumberFormatValues) =>
    onChange(values.value ? toToken(values.value) : undefined);

  return (
    <TokenCard
      classes="bg-tertiary rounded-t-[16px] pb-[32px]"
      token={mode === 'stake' ? 'CELO' : 'stCELO'}
      titleChild={getTitle(error, mode)}
      inputChild={
        <NumberFormat
          className={`focus:outline-none bg-transparent placeholder-primary ${
            error ? 'text-error' : ''
          } ${amount === undefined ? 'text-secondary' : ''}`}
          placeholder="0.00"
          thousandSeparator
          onValueChange={onInputChange}
          value={amount ? amount.format() : ''}
          decimalScale={DISPLAY_DECIMALS}
          isNumericString
          allowNegative={false}
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} balance={balance} />}
    />
  );
};
