import { PropsWithChildren, ReactElement } from 'react';

interface ButtonProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  color?: 'purple' | 'blue' | 'orange'; // defaults to blue
  classes?: string;
  bold?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
  title?: string;
  passThruProps?: any;
}

export const SolidButton = (props: PropsWithChildren<ButtonProps>) => {
  const {
    type,
    onClick,
    color: _color,
    classes,
    bold,
    icon,
    disabled,
    title,
    passThruProps,
  } = props;
  const color = _color ?? 'blue';

  const base = 'flex items-center justify-center rounded-2xl transition-all duration-300';
  let baseColors, onHover, onActive;
  if (color === 'blue') {
    baseColors = 'bg-blue-700 text-white';
    onHover = 'bg-blue-700';
    onActive = 'bg-blue-700';
  } else if (color === 'purple') {
    baseColors = 'bg-purple-700 text-black';
    onHover = 'hover:bg-purple-800';
    onActive = 'active:bg-purple-900';
  } else if (color === 'orange') {
    baseColors = 'bg-orange-700 text-black';
    onHover = 'hover:bg-orange-800';
    onActive = 'active:bg-orange-900';
  }

  const onDisabled = 'disabled:bg-gray-300 disabled:text-gray-500';
  const weight = bold ? 'font-semibold' : '';
  const allClasses = `${base} ${baseColors} ${onHover} ${onDisabled} ${onActive} ${weight} ${classes}`;

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
