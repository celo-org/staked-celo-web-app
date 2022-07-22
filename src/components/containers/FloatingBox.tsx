import { PropsWithChildren } from 'react';

interface Props {
  width?: string;
  maxWidth?: string;
  classes?: string;
}

export const FloatingBox = (props: PropsWithChildren<Props>) => {
  const { width, maxWidth, classes } = props;
  return (
    <div style={{ maxHeight: '80%' }} className={`${width} ${maxWidth} p-3 rounded-2xl ${classes}`}>
      {props.children}
    </div>
  );
};
