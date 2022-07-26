import Image from 'next/image';
import { useThemeContext } from 'src/providers/ThemeProvider';

type IconName = '';

interface ThemedIcons {
  dark: any;
  light: any;
}

// @ts-ignore
const icons: Record<IconName, ThemedIcons> = {};

interface ThemedIconProps {
  name: IconName;
  alt: string;
  quality?: number;
  width?: number;
  height?: number;
}

export const ThemedIcon = ({
  name,
  alt,
  quality = 100,
  width = 32,
  height = 32,
}: ThemedIconProps) => {
  const { theme } = useThemeContext();
  return (
    <Image src={icons?.[name]?.[theme]} alt={alt} quality={quality} width={width} height={height} />
  );
};
