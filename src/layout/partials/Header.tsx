import Image from 'next/image';
import Link from 'next/link';
import ConnectWalletButton from 'src/features/wallet/ConnectWalletButton';
import Logo from 'src/images/logo.svg';
import { NavBar } from './NavBar';

export function Header({ pathName }: { pathName: string }) {
  return (
    <header className="w-screen py-5 px-3 sm:pl-5 sm:pr-6">
      <div className="flex items-center justify-between p-2">
        <Link href="/">
          <a className="flex items-center">
            <div className="flex scale-90 sm:scale-100">
              <Image src={Logo} alt="Liquid Staking Logo" quality={100} width={50} height={50} />
            </div>
          </a>
        </Link>
        <ConnectWalletButton />
      </div>
      <div className="flex justify-center py-6">
        <NavBar pathName={pathName} />
      </div>
    </header>
  );
}
