import Image from 'next/image';
import IndicatorSVG from 'src/images/icons/indicator.svg';

interface IndicatorIconProps {
  classes?: string;
}
export const IndicatorIcon = ({ classes }: IndicatorIconProps) => (
  <span className={`${classes} inline-flex`}>
    <Image
      src={IndicatorSVG}
      alt="Connection indicator"
      width={8}
      height={8}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  </span>
);
