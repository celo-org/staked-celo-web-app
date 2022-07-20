import { FormikErrors } from 'formik';
import { useCallback } from 'react';
import { SwapFormValues } from 'src/features/swap/types';
import { toCeloWei } from 'src/formatters/amount';
import { Celo, CeloWei, StakedCeloWei } from 'src/types/units';

export function useFormValidator(balance: CeloWei | StakedCeloWei) {
  return useCallback(
    (values?: SwapFormValues): FormikErrors<SwapFormValues> => {
      if (!values || !values.amount) return { amount: 'Amount Required' };
      if (values.amount < 0) return { amount: 'Amount cannot be negative' };
      if (balance.isLessThan(toCeloWei(new Celo(values.amount))))
        return { amount: 'Amount cannot be greater than balance' };

      return {};
    },
    [balance]
  );
}
