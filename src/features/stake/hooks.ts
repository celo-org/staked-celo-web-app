import BigNumber from 'bignumber.js'

export type ExchangeValueFormatter = (fromAmount: BigNumber | null | undefined) => string

const valueFormatter = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.log(args)
  return {
    value: 12,
    rate: 1.2,
  }
}

export const useStake = () => ({
  valueFormatter,
})

const estDepositValue = (amount: number) => amount * 1.03

export const useEstimate = () => ({
  estDepositValue,
})
