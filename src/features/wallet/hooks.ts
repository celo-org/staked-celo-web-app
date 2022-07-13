import BigNumber from 'bignumber.js'
import { WEI_PER_UNIT } from 'src/config/consts'
import { AccountBalances } from 'src/features/wallet/types'

const address = '332332-232323-232323'
const balances: AccountBalances = {
  CELO: new BigNumber(WEI_PER_UNIT).multipliedBy(50),
  stCELO: new BigNumber(WEI_PER_UNIT).multipliedBy(30),
}
const connect: () => Promise<boolean> = () => Promise.resolve(true)

export const useWallet = () => ({
  address,
  balances,
  connect,
})
