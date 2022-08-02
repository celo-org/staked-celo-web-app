import Image from 'next/image';
import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { WalletButton } from 'src/features/wallet/WalletButton';
import DarkThemeIcon from 'src/images/icons/theme-dark.svg';
import LightThemeIcon from 'src/images/icons/theme-light.svg';
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
      width={40}
      height={40}
      onClick={toggleTheme}
      className="cursor-pointer"
    />
  );
};

export const Header = () => {
  const { isConnected } = useAccountContext();

  return (
    <header className="w-screen px-[32px] h-[80px] flex items-center justify-between">
      <Link href="/">
        <a className="flex items-center">
          <div className="flex scale-90 sm:scale-100">
            <ThemedIcon
              name="logo"
              alt="Liquid Staking Logo"
              quality={100}
              width={40}
              height={40}
            />
          </div>
        </a>
      </Link>
      {isConnected && <WalletButton />}
      <ThemeToggle />
    </header>
  );
};
