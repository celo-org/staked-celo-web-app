import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { SolidButton } from 'src/components/buttons/SolidButton';
import { StakeFormValues } from 'src/features/stake/types';
import { useTimeout } from 'src/hooks/timeout';

interface ButtonProps {
  address?: string;
}

export const SubmitButton = ({ address }: ButtonProps) => {
  const { errors, setErrors, touched, setTouched } = useFormikContext<StakeFormValues>();
  const error = touched.amount && errors.amount;
  const classes = error ? 'bg-red-500 hover:bg-red-500 active:bg-red-500' : '';
  const text = error ? (error as string) : 'Continue';
  const type = address ? 'submit' : 'button';

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setErrors, setTouched, errors, touched]);

  useTimeout(clearErrors, 3000);

  return (
    <SolidButton size="m" type={type} classes={classes}>
      {text}
    </SolidButton>
  );
};
