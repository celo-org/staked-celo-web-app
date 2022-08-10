import { FormEventHandler, useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { Token, toToken } from 'src/utils/tokens';
import { Mode } from '../types';
import { Detail } from '../utils/details';
import { BalanceTools } from './BalanceTools';
import { ReceiveSummary } from './ReceiveSummary';
import { SubmitButton } from './SubmitButton';
import { TokenCard } from './TokenCard';

interface SwapFormProps {
  amount: Token | null;
  error: string | null;
  onSubmit: () => void;
  onChange: (amount?: Token) => void;
  balance: Token;
  mode: Mode;
  receiveAmount: Token;
  details: Detail[];
  onModeChange: (mode: Mode) => void;
}

export const SwapForm = ({
  amount,
  error,
  onSubmit,
  onChange,
  balance,
  mode,
  receiveAmount,
  onModeChange,
}: SwapFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const { reloadExchangeContext } = useExchangeContext();
  const { reloadProtocolContext } = useProtocolContext();
  const disabledSubmit = !amount || isLoading || !!error || !isTouched;

  const submit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await onSubmit();
        await Promise.all([reloadExchangeContext(), reloadProtocolContext()]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSubmit, reloadExchangeContext, reloadProtocolContext]
  );

  const onInputChange = (value: Token | undefined) => {
    setIsTouched(true);
    onChange(value);
  };

  const switchModes = () => {
    onModeChange(mode === 'stake' ? 'unstake' : 'stake');
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
        <div className="absolute inline-flex cursor-pointer" onClick={switchModes}>
          <ThemedIcon name="arrow" alt="Arrow" width={40} height={40} quality={100} />
        </div>
        <ReceiveSummary value={receiveAmount} mode={mode} />
      </div>
      <div className="flex justify-center mt-[16px]">
        <SubmitButton mode={mode} disabled={disabledSubmit} pending={isLoading} />
      </div>
    </form>
  );
};

interface FormInputProps {
  onChange: (amount?: Token) => void;
  balance: Token;
  mode: Mode;
  error: string | null;
  amount: Token | null;
}

const getTitle = (error: string | null, mode: Mode) => {
  if (error) return <span className="text-color-error whitespace-nowrap">{error}</span>;
  switch (mode) {
    case 'stake':
      return 'Stake';
    case 'unstake':
      return 'Unstake';
  }
};

const SwapFormInput = ({ mode, balance, amount, onChange, error }: FormInputProps) => {
  const onClickUseMax = () => (balance.format() !== amount?.format() ? onChange(balance) : null);
  const onInputChange = (values: NumberFormatValues) => {
    const { value } = values;
    // Returning in case of '.' makes it possible to input number starting with decimal separator
    // If we wanted to convert decimal separator to Token we would need to use 0 as value
    // That would result in separator being replaced with '0' by 'react-number-format'
    // In case input is /.[0-9]+/ 'react-number-format' doesn't prepend 0
    if (value === '.') return;
    onChange(value ? toToken(value) : undefined);
  };

  return (
    <TokenCard
      classes="bg-tertiary rounded-t-[16px] pb-[32px]"
      token={mode === 'stake' ? 'CELO' : 'stCELO'}
      titleChild={
        <OpacityTransition id={mode}>
          <span>{getTitle(error, mode)}</span>
        </OpacityTransition>
      }
      inputChild={
        <NumberFormat
          className={`focus:outline-none bg-transparent placeholder-primary ${
            error ? 'text-color-error' : ''
          } ${amount === undefined ? 'text-color-secondary' : ''}`}
          placeholder="0.00"
          thousandSeparator
          onValueChange={onInputChange}
          value={amount ? amount.format() : ''}
          decimalScale={DISPLAY_DECIMALS}
          isNumericString
          allowNegative={false}
        />
      }
      infoChild={<BalanceTools mode={mode} onClickUseMax={onClickUseMax} balance={balance} />}
    />
  );
};
