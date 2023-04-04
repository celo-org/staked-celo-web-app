import { PropsWithChildren, useId } from 'react';

interface RadioButtonProps {
  checked?: boolean;
  onChange?: () => void;
  classes?: string;
}

export const RadioButton = (props: PropsWithChildren<RadioButtonProps>) => {
  const id = useId();
  const containerClasses = 'flex items-center mb-4';
  const radioClasses =
    'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600';
  const textClasses = 'ml-2 text-sm font-medium text-gray-900 dark:text-gray-300';

  return (
    <div className={containerClasses}>
      <input
        checked={!!props.checked}
        id={id}
        type="radio"
        value=""
        name="radio-btn"
        className={radioClasses}
        onChange={props.onChange}
      />
      <label htmlFor={id} className={textClasses}>
        {props.children}
      </label>
    </div>
  );
};
