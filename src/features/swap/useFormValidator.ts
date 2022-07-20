import { FormikErrors } from 'formik';
import { useCallback } from 'react';
import { StakeToken, SwapFormValues } from 'src/features/swap/types';
import { toCeloWei } from 'src/formatters/amount';
import { Celo, CeloWei, StCeloWei } from 'src/types/units';

export function useFormValidator(balance: CeloWei | StCeloWei, token: StakeToken) {
  return useCallback(
    (values?: SwapFormValues): FormikErrors<SwapFormValues> => {
      if (!values || !values.amount) return { amount: 'Amount Required' };
      if (values.amount < 0) return { amount: 'Amount cannot be negative' };
      if (balance.isLessThan(toCeloWei(new Celo(values.amount)))) {
        console.log('error');
        return { amount: `Not enough ${token}` };
      }

      return {};
    },
    [balance]
  );
}
