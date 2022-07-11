import Image from 'next/image'
import { SolidButton } from 'src/components/buttons/SolidButton'
import Wallet from 'src/images/icons/wallet.svg'

export function ConnectButton() {
  // eslint-disable-next-line no-console
  const connect = () => console.log('click')
  return (
    <SolidButton
      size="l"
      color="white"
      classes="shadow-md px-3 sm:px-4"
      icon={<WalletIcon />}
      onClick={connect}
    >
      <div className="hidden sm:block">Connect</div>
    </SolidButton>
  )
}

function WalletIcon() {
  return (
    <div className="flex items-center sm:mr-2">
      <Image src={Wallet} alt="Wallet" width={18} height={18} />
    </div>
  )
}
