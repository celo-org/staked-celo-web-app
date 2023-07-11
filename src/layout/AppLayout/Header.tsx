import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useThemeContext } from 'src/contexts/theme/ThemeContext';
import { WalletButton } from 'src/features/wallet/components/WalletButton';

interface ThemeToggleProps {
  isConnectPage: boolean;
}

export const ThemeToggle = ({ isConnectPage }: ThemeToggleProps) => {
  const { theme, setTheme } = useThemeContext();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const iconProps = {
    alt: 'Toggle theme',
    quality: 100,
    width: 40,
    height: 40,
    onClick: toggleTheme,
    classes: 'cursor-pointer',
  };

  if (!isConnectPage) return <ThemedIcon name="theme" {...iconProps} />;

  return (
    <>
      <span className="sm:hidden inline-flex">
        <ThemedIcon name="theme-oposite" {...iconProps} />
      </span>
      <span className="hidden sm:inline-flex">
        <ThemedIcon name="theme" {...iconProps} />
      </span>
    </>
  );
};

interface HeaderProps {
  isConnectPage: boolean;
}

export const Header = ({ isConnectPage = true }: HeaderProps) => {
  const { isConnected } = useAccountContext();

  return (
    <header className="px-base w-full h-[80px] flex items-center justify-between">
      <Link href="/">
        <a className={`flex items-center ${isConnectPage ? 'invisible' : ''}`}>
          <ThemedIcon name="logo" alt="StakedCelo Home" quality={100} width={40} height={40} />
        </a>
      </Link>
      {isConnected && <WalletButton />}
      <ThemeToggle isConnectPage={isConnectPage} />
    </header>
  );
};
