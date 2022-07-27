import { PropsWithChildren, ReactElement } from 'react';

interface ButtonProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  classes?: string;
  bold?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
  title?: string;
  passThruProps?: any;
}

export const SolidButton = (props: PropsWithChildren<ButtonProps>) => {
  const { type, onClick, classes, bold, icon, disabled, title, passThruProps } = props;

  const base =
    'themed:solid-button flex items-center justify-center rounded-2xl transition-all duration-300 disabled:cursor-not-allowed';

  const weight = bold ? 'font-semibold' : '';
  const allClasses = `${base} ${weight} ${classes}`;

  return (
    <button
      onClick={onClick}
      type={type ?? 'button'}
      disabled={disabled ?? false}
      title={title}
      className={allClasses}
      {...passThruProps}
    >
      {icon ? (
        <div className="flex items-center justify-center">
          {props.icon}
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      )}
    </button>
  );
};
