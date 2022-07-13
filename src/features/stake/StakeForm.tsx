import { Field, Form, Formik, FormikErrors, useFormikContext } from 'formik'
import Image from 'next/image'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { SolidButton } from 'src/components/buttons/SolidButton'
import { DISPLAY_DECIMALS } from 'src/config/consts'
import { useEstimate } from 'src/features/stake/hooks'
import { StakeFormValues } from 'src/features/stake/types'
import { useFormValidator } from 'src/features/stake/useFormValidator'
import { useWallet } from 'src/features/wallet/hooks'
import { AccountBalances } from 'src/features/wallet/types'
import CeloDark from 'src/images/icons/celo-dark.svg'
import { FloatingBox } from 'src/layout/FloatingBox'
import { fromWeiRounded } from 'src/utils/amount'
import { useTimeout } from 'src/utils/timeout'

const initialValues: StakeFormValues = {
  amount: undefined,
}

export const StakeForm = () => {
  const onSubmit = (values: StakeFormValues) => {
    // eslint-disable-next-line no-console
    console.log(values)
  }

  const validateForm = useFormValidator()

  return (
    <div className="flex justify-center">
      <StakeFormInner onSubmit={onSubmit} validateForm={validateForm} />
    </div>
  )
}

interface StakeFormInnerProps {
  onSubmit: (values: StakeFormValues) => void
  validateForm: (values?: StakeFormValues) => FormikErrors<StakeFormValues>
}

export function StakeFormInner({ onSubmit, validateForm }: StakeFormInnerProps) {
  const { connect, address, balances } = useWallet()

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
          <StakeFormInputs balances={balances} isConnected={!!address} />
        </FloatingBox>

        <div className="flex justify-center mt-5 mb-1">
          <SubmitButton address={address} connect={connect} />
        </div>
      </Form>
    </Formik>
  )
}

interface BalanceToolsProps {
  roundedBalance: number
  onClickUseDecimalFraction: (decimalFraction: number) => () => void
}

function BalanceTools(props: BalanceToolsProps) {
  const { roundedBalance, onClickUseDecimalFraction } = props
  return (
    <div>
      <span className="text-xs text-gray-500 mr-2">
        Balance: {roundedBalance.toFixed(DISPLAY_DECIMALS)}
      </span>
      <button
        type="button"
        title="Use full balance"
        className="text-xs text-gray-500 mr-2 hover:underline"
        onClick={onClickUseDecimalFraction(0.5)}
      >
        50%
      </button>
      <button
        type="button"
        title="Use full balance"
        className="text-xs text-gray-500 mr-2 hover:underline"
        onClick={onClickUseDecimalFraction(1)}
      >
        Max
      </button>
    </div>
  )
}

interface FormInputProps {
  balances: AccountBalances
  isConnected: boolean
}

function StakeFormInputs(props: FormInputProps) {
  const { balances, isConnected } = props
  const { values, setFieldValue } = useFormikContext<StakeFormValues>()
  const { estDepositValue } = useEstimate()
  const value = values.amount && estDepositValue(values.amount)
  const estimatedRate: number = estDepositValue(1)
  const roundedBalance = fromWeiRounded(balances.CELO)

  const onClickUseDecimalFraction = (decimalFraction: number) => () => {
    setFieldValue('amount', roundedBalance * decimalFraction)

    if (decimalFraction === 1) {
      toast.warn('Consider keeping some CELO for transaction fees')
    }
  }

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
        {isConnected && (
          <BalanceTools
            onClickUseDecimalFraction={onClickUseDecimalFraction}
            roundedBalance={roundedBalance}
          />
        )}
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
  )
}

interface ButtonProps {
  address: string | null
  connect: () => Promise<boolean>
}

function SubmitButton({ address, connect }: ButtonProps) {
  const { errors, setErrors, touched, setTouched } = useFormikContext<StakeFormValues>()
  const error = touched.amount && errors.amount
  const classes = error ? 'bg-red-500 hover:bg-red-500 active:bg-red-500' : ''
  const text = error ? (error as string) : 'Continue'
  const type = address ? 'submit' : 'button'
  const onClick = address ? undefined : connect

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setErrors, setTouched, errors, touched])

  useTimeout(clearErrors, 3000)

  return (
    <SolidButton size="m" type={type} onClick={onClick} classes={classes}>
      {text}
    </SolidButton>
  )
}
