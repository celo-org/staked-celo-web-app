import { PropsWithChildren } from 'react';

interface ButtonProps {
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  classes?: string;
  disabled?: boolean;
}

export const Button = (props: PropsWithChildren<ButtonProps>) => {
  const { type, onClick, classes, disabled } = props;

  const displayClasses = 'flex items-center justify-center rounded-[16px]  h-[72px]';
  const transitionClasses = 'transition-all duration-300';
  const textClasses = 'text-[18px] leading-[24px] font-medium';

  const allClasses = `${displayClasses} ${transitionClasses} ${textClasses} ${classes} disabled:cursor-not-allowed`;

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
