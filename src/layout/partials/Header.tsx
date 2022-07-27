import Image from 'next/image';
import Link from 'next/link';
import { ConnectWalletButton } from 'src/features/wallet/ConnectWalletButton';
import DarkThemeIcon from 'src/images/icons/darkTheme.svg';
import LightThemeIcon from 'src/images/icons/lightTheme.svg';
import Logo from 'src/images/logo.svg';
import { Theme, useThemeContext } from 'src/providers/ThemeProvider';
import { NavBar } from './NavBar';

const themeIcons: Record<Theme, any> = {
  light: LightThemeIcon,
  dark: DarkThemeIcon,
};

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeContext();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Image
      src={themeIcons[theme]}
      alt="Toggle theme"
      quality={100}
      width={25}
      height={25}
      onClick={toggleTheme}
      className="cursor-pointer"
    />
  );
};

export const Header = ({ pathName }: { pathName: string }) => {
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
        <ThemeToggle />
      </div>
      <div className="flex justify-center py-3">
        <NavBar pathName={pathName} />
      </div>
    </header>
  );
};
