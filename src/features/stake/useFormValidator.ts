import { FormikErrors } from 'formik';
import { useCallback } from 'react';
import { StakeFormValues } from 'src/features/stake/types';

export function useFormValidator() {
  return useCallback((values?: StakeFormValues): FormikErrors<StakeFormValues> => {
    if (!values || !values.amount) return { amount: 'Amount Required' };
    if (values.amount < 0) return { amount: 'Amount cannot be negative' };

    return {};
  }, []);
}
