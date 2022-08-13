import Image from 'next/image';
import { OpacityTransition } from 'src/components/transitions/OpacityTransition';
import { useThemeContext } from 'src/contexts/theme/ThemeContext';
import ArrowDark from 'src/images/icons/arrow-dark.svg';
import ArrowLight from 'src/images/icons/arrow-light.svg';
import CaretDark from 'src/images/icons/caret-dark.svg';
import CaretLight from 'src/images/icons/caret-light.svg';
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
  | 'github'
  | 'discord'
  | 'twitter'
  | 'caret'
  | 'spinner'
  | 'spinner-contrast'
  | 'spinner-purple'
  | 'theme'
  | 'theme-oposite';

interface ThemedIcons {
  dark: any;
  light: any;
}

const icons: Record<IconName, ThemedIcons> = {
  arrow: { light: ArrowDark, dark: ArrowLight },
  logo: { light: LogoDark, dark: LogoLight },
  info: { light: InfoDark, dark: InfoLight },
  receive_info: { light: InfoOrange, dark: InfoAqua },
  github: { light: GithubDark, dark: GithubLight },
  discord: { light: DiscordDark, dark: DiscordLight },
  twitter: { light: TwitterDark, dark: TwitterLight },
  caret: { light: CaretDark, dark: CaretLight },
  spinner: { light: SpinnerLight, dark: SpinnerDark },
  'spinner-contrast': { light: SpinnerDark, dark: SpinnerLight },
  'spinner-purple': { light: SpinnerPurpleDark, dark: SpinnerPurpleLight },
  theme: { light: ThemeDark, dark: ThemeLight },
  'theme-oposite': { light: ThemeOpositeDark, dark: ThemeOpositeLight },
};

interface ThemedIconProps {
  name: IconName;
  alt: string;
  quality?: number;
  width?: number;
  height?: number;
  classes?: string;
  onClick?: () => void;
}

export const ThemedIcon = ({
  name,
  alt,
  quality = 100,
  width = 32,
  height = 32,
  classes = '',
  onClick,
}: ThemedIconProps) => {
  const { theme } = useThemeContext();
  return (
    <OpacityTransition id={theme} classes="inline-flex">
      <span className="inline-flex items-center">
        <Image
          src={icons?.[name]?.[theme]}
          alt={alt}
          className={classes}
          quality={quality}
          width={width}
          height={height}
          onClick={onClick}
        />
      </span>
    </OpacityTransition>
  );
};
