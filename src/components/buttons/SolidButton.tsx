import { PropsWithChildren } from 'react';

interface ButtonProps {
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  classes?: string;
  disabled?: boolean;
}

export const SolidButton = (props: PropsWithChildren<ButtonProps>) => {
  const { type, onClick, classes, disabled } = props;

  const base =
    'flex items-center justify-center rounded-2xl transition-all duration-300 disabled:cursor-not-allowed';

  const allClasses = `${base} ${classes}`;

  return (
    <button
      onClick={onClick}
      type={type ?? 'button'}
      disabled={disabled ?? false}
      className={allClasses}
    >
      {props.children}
    </button>
  );
};
