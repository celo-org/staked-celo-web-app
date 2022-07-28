import Image from 'next/image';
import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { ConnectWalletButton } from 'src/features/wallet/ConnectWalletButton';
import DarkThemeIcon from 'src/images/icons/darkTheme.svg';
import LightThemeIcon from 'src/images/icons/lightTheme.svg';
import { useAccountContext } from 'src/providers/AccountProvider';
import { Theme, useThemeContext } from 'src/providers/ThemeProvider';

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

export const Header = () => {
  const { isConnected } = useAccountContext();

  return (
    <header className="w-screen py-5 px-3 sm:pl-5 sm:pr-6">
      <div className="flex items-center justify-between p-2">
        <Link href="/">
          <a className="flex items-center">
            <div className="flex scale-90 sm:scale-100">
              <ThemedIcon
                name="logo"
                alt="Liquid Staking Logo"
                quality={100}
                width={50}
                height={50}
              />
            </div>
          </a>
        </Link>
        {isConnected && <ConnectWalletButton />}
        <ThemeToggle />
      </div>
    </header>
  );
};
