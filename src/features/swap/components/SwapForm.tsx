import { FormEventHandler, useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { TransactionCalloutModal } from 'src/components/TransactionCalloutModal';
import { SubmitButton } from 'src/components/buttons/SubmitButton';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TxCallbacks } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import useModeChange from 'src/hooks/useModeChange';
import { Mode } from 'src/types';
import { Token, toToken } from 'src/utils/tokens';
import { BalanceTools } from './BalanceTools';
import { ReceiveSummary } from './ReceiveSummary';
import { TokenCard } from './TokenCard';

interface SwapFormProps {
  mode: Mode;
  amount: Token | null;
  receiveAmount: Token | null;
  balance: Token;
  error: string | null;
  setMaxAmount: () => void;
  onSubmit: (callbacks: TxCallbacks) => void;
  onChange: (amount?: Token) => void;
}

export const SwapForm = ({
  mode,
  amount,
  receiveAmount,
  balance,
  error,
  setMaxAmount,
  onSubmit,
  onChange,
}: SwapFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCalloutModalOpened, setIsCalloutModalOpened] = useState(false);
  const { reloadProtocolContext } = useProtocolContext();
  const disabledSubmit = !amount || isLoading || !!error;

  const submit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setIsCalloutModalOpened(true);
      setIsLoading(true);
      try {
        await onSubmit({ onSent: () => setIsCalloutModalOpened(false) });
        await reloadProtocolContext();
      } finally {
        setIsLoading(false);
        setIsCalloutModalOpened(false);
      }
    },
    [onSubmit, reloadProtocolContext]
  );

  const onModeChange = useModeChange();
  return (
    <>
      <form className="w-full justify-center items-center mt-[24px]" onSubmit={submit}>
        <div className="flex flex-col justify-center items-center w-full bg-secondary p-[8px] rounded-[16px]">
          <SwapFormInput
            mode={mode}
            amount={amount}
            balance={balance}
            error={error}
            setMaxAmount={setMaxAmount}
            onChange={onChange}
          />
          <div
            className="absolute inline-flex cursor-pointer"
            onClick={() => onModeChange(mode === Mode.stake ? Mode.unstake : Mode.stake)}
          >
            <ThemedIcon name="arrow" alt="Arrow" width={40} height={40} quality={100} />
          </div>
          <ReceiveSummary value={receiveAmount} mode={mode} />
        </div>
        <div className="flex justify-center mt-[16px]">
          <SubmitButton mode={mode} disabled={disabledSubmit} pending={isLoading} />
        </div>
      </form>
      <TransactionCalloutModal
        isOpened={isCalloutModalOpened}
        close={() => setIsCalloutModalOpened(false)}
      />
    </>
  );
};

interface FormInputProps {
  mode: Mode;
  amount: Token | null;
  balance: Token;
  error: string | null;
  setMaxAmount: () => void;
  onChange: (amount?: Token) => void;
}

const getTitle = (error: string | null, mode: Mode) => {
  if (error) return <span className="text-color-error whitespace-nowrap">{error}</span>;
  switch (mode) {
    case Mode.unstake:
      return 'Unstake';
    default:
    case Mode.stake:
      return 'Stake';
  }
};

const SwapFormInput = ({
  mode,
  amount,
  balance,
  error,
  setMaxAmount,
  onChange,
}: FormInputProps) => {
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
      token={mode === Mode.stake ? 'CELO' : 'stCELO'}
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
          value={amount ? amount.displayAsBase(true) : ''}
          decimalScale={DISPLAY_DECIMALS}
          isNumericString
          allowNegative={false}
          inputMode="decimal"
        />
      }
      infoChild={<BalanceTools mode={mode} onClickUseMax={setMaxAmount} balance={balance} />}
    />
  );
};
