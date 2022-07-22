import BigNumber from 'bignumber.js';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useCallback, useState } from 'react';
import { FloatingBox } from 'src/components/containers/FloatingBox';
import { CostsSummary } from 'src/features/swap/CostsSummary';
import { TokenCard } from 'src/features/swap/FormTemplate';
import { ReceiveSummary } from 'src/features/swap/ReceiveSummary';
import { fromWeiRounded } from 'src/formatters/amount';
import Arrow from 'src/images/icons/arrow.svg';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const isValid = !error;
  const validateForm = useFormValidator(balance, fromToken);
  const { reloadExchangeContext } = useExchangeContext();

  const submit = useCallback(async () => {
    if (error) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(amount);
      await reloadExchangeContext();
    } finally {
      setIsLoading(false);
    }
    setAmount(0);
  }, [amount, error, onSubmit, reloadExchangeContext]);

  const onInputChange = (value: number | undefined) => {
    setError(validateForm(value));
    setAmount(value);
  };

  return (
    <form className="w-full justify-center items-center text-white" onSubmit={submit}>
      <FloatingBox
        width="w-full"
        classes="overflow-visible bg-gray-800 flex flex-col justify-center items-center"
      >
        <SwapFormInput balance={balance} onChange={onInputChange} token={fromToken} error={error} />
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
        <SubmitButton color="purple" toToken={toToken} pending={isLoading} />
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
  onChange: (amount: number) => void;
  balance: CeloWei | StCeloWei;
  token: StakeToken;
  error?: string;
}

const getTitle = (error: string | undefined, fromToken: StakeToken) => {
  if (error) {
    return <span className="text-red">{error}</span>;
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
  const roundedBalance = fromWeiRounded(balance);

  const onClickUseMax = () => () => {
    onChange(roundedBalance);
  };

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  }, []);

  return (
    <TokenCard
      classes="w-full	bg-gray-900"
      token={token}
      titleChild={getTitle(props.error, token)}
      inputChild={
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="0.00"
          className={`mr-auto bg-transparent text-left focus:outline-none ${
            props.error ? 'text-red' : ''
          }`}
          onChange={onInputChange}
        />
      }
      infoChild={<BalanceTools onClickUseMax={onClickUseMax} roundedBalance={roundedBalance} />}
    />
  );
};
