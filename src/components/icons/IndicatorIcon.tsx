import Image from 'next/image';
import IndicatorSVG from 'src/images/icons/indicator.svg';

interface IndicatorIconProps {
  classes?: string;
}
export const IndicatorIcon = ({ classes }: IndicatorIconProps) => (
  <div className={`${classes} inline-flex`}>
    <Image className={classes} src={IndicatorSVG} alt="Connection indicator" width={8} height={8} />
  </div>
);
