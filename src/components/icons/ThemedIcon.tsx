import Image from 'next/image';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { useThemeContext } from 'src/contexts/theme/ThemeContext';
import ArrowDark from 'src/images/icons/arrow-dark.svg';
import ArrowLight from 'src/images/icons/arrow-light.svg';
import CaretDark from 'src/images/icons/caret-dark.svg';
import CaretLight from 'src/images/icons/caret-light.svg';
import CaretPurpleDark from 'src/images/icons/caret-purple-dark.svg';
import CaretPurpleLight from 'src/images/icons/caret-purple-light.svg';
import ClipboardDark from 'src/images/icons/clipboard-dark.svg';
import ClipboardLight from 'src/images/icons/clipboard-light.svg';
import CloseDark from 'src/images/icons/close-dark.svg';
import CloseLight from 'src/images/icons/close-light.svg';
import DiscordDark from 'src/images/icons/discord-dark.svg';
import DiscordLight from 'src/images/icons/discord-light.svg';
import GithubDark from 'src/images/icons/github-dark.svg';
import GithubLight from 'src/images/icons/github-light.svg';
import InfoAqua from 'src/images/icons/info-aqua.svg';
import InfoDark from 'src/images/icons/info-dark.svg';
import InfoLight from 'src/images/icons/info-light.svg';
import InfoOrange from 'src/images/icons/info-orange.svg';
import LogoDark from 'src/images/icons/logo-dark.svg';
import LogoLight from 'src/images/icons/logo-light.svg';
import SpinnerDark from 'src/images/icons/spinner-dark.svg';
import SpinnerLight from 'src/images/icons/spinner-light.svg';
import SpinnerPurpleDark from 'src/images/icons/spinner-purple-dark.svg';
import SpinnerPurpleLight from 'src/images/icons/spinner-purple-light.svg';
import ThemeDark from 'src/images/icons/theme-dark.svg';
import ThemeLight from 'src/images/icons/theme-light.svg';
import ThemeOpositeDark from 'src/images/icons/theme-oposite-dark.svg';
import ThemeOpositeLight from 'src/images/icons/theme-oposite-light.svg';
import TwitterDark from 'src/images/icons/twitter-dark.svg';
import TwitterLight from 'src/images/icons/twitter-light.svg';

type IconName =
  | 'arrow'
  | 'logo'
  | 'info'
  | 'receive_info'
  | 'warning_info'
  | 'github'
  | 'discord'
  | 'twitter'
  | 'caret'
  | 'caret-purple'
  | 'spinner'
  | 'spinner-contrast'
  | 'spinner-purple'
  | 'theme'
  | 'theme-oposite'
  | 'close'
  | 'clipboard';

interface ThemedIcons {
  dark: any;
  light: any;
}

const icons: Record<IconName, ThemedIcons> = {
  arrow: { light: ArrowDark, dark: ArrowLight },
  logo: { light: LogoDark, dark: LogoLight },
  info: { light: InfoDark, dark: InfoLight },
  receive_info: { light: InfoAqua, dark: InfoAqua },
  warning_info: { light: InfoOrange, dark: InfoOrange },
  github: { light: GithubDark, dark: GithubLight },
  discord: { light: DiscordDark, dark: DiscordLight },
  twitter: { light: TwitterDark, dark: TwitterLight },
  caret: { light: CaretDark, dark: CaretLight },
  'caret-purple': { light: CaretPurpleDark, dark: CaretPurpleLight },
  spinner: { light: SpinnerLight, dark: SpinnerDark },
  'spinner-contrast': { light: SpinnerDark, dark: SpinnerLight },
  'spinner-purple': { light: SpinnerPurpleDark, dark: SpinnerPurpleLight },
  theme: { light: ThemeDark, dark: ThemeLight },
  'theme-oposite': { light: ThemeOpositeDark, dark: ThemeOpositeLight },
  close: { light: CloseDark, dark: CloseLight },
  clipboard: { light: ClipboardDark, dark: ClipboardLight },
};

interface ThemedIconProps {
  name: IconName;
  alt: string;
  quality?: number;
  width?: number;
  height?: number;
  classes?: string;
  fill?: boolean;
  onClick?: () => void;
}

export const ThemedIcon = ({
  name,
  alt,
  quality = 100,
  width = 32,
  height = 32,
  classes = '',
  fill = false,
  onClick,
}: ThemedIconProps) => {
  const { theme } = useThemeContext();
  const sizeClasses = fill ? 'w-full h-full' : '';
  return (
    <OpacityTransition id={theme} classes={`inline-flex ${sizeClasses}`}>
      <span className={`inline-flex items-center ${sizeClasses}`}>
        <Image
          src={icons?.[name]?.[theme]}
          alt={alt}
          className={classes}
          quality={quality}
          width={width}
          height={height}
          onClick={onClick}
          layout={fill ? 'fill' : 'intrinsic'}
        />
      </span>
    </OpacityTransition>
  );
};
