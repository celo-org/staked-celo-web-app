import { FormikErrors } from 'formik';
import { useCallback } from 'react';
import { SwapFormValues } from 'src/features/swap/types';
import { CeloWei, StakedCeloWei } from 'src/types/units';

export function useFormValidator(balance: CeloWei | StakedCeloWei) {
  return useCallback((values?: SwapFormValues): FormikErrors<SwapFormValues> => {
    if (!values || !values.amount) return { amount: 'Amount Required' };
    if (values.amount < 0) return { amount: 'Amount cannot be negative' };
    if (balance.isGreaterThan(values.amount))
      return { amount: 'Amount cannot be greater than balance' };

    return {};
  }, []);
}
