import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Mode } from 'src/types';

export default function useModeChange() {
  const router = useRouter();
  const onModeChange = useCallback(
    (mode: Mode) => {
      void router.push({
        pathname: `/${mode}`,
      });
    },
    [router]
  );

  return onModeChange;
}
