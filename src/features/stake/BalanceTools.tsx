import { DISPLAY_DECIMALS } from 'src/config/consts'

interface BalanceToolsProps {
  roundedBalance: number
  onClickUseDecimalFraction: (decimalFraction: number) => () => void
}

export const BalanceTools = (props: BalanceToolsProps) => {
  const { roundedBalance, onClickUseDecimalFraction } = props
  return (
    <div>
      <span className="text-xs text-gray-500 mr-2">
        Balance: {roundedBalance.toFixed(DISPLAY_DECIMALS)}
      </span>
      <button
        type="button"
        title="Use half of the balance"
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
