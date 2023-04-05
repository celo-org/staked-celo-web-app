import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Switcher } from 'src/components/switcher/Switcher';
import { Governance } from 'src/features/governance/components/Governance';
import { Swap } from 'src/features/swap/components/Swap';
import { Validators } from 'src/features/validators/components/Validators';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

const SwapPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string[] };
  const mode = slug ? slug[0] : Mode.stake;

  const page = useMemo(() => {
    switch (mode) {
      case Mode.stake:
      case Mode.unstake:
        return <Swap mode={mode as Mode} />;
      case Mode.governance:
        return <Governance />;
      case Mode.validators:
        return <Validators />;
      default:
        return null;
    }
  }, [mode]);

  if (!page) return page;

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={mode as Mode} />
      {page}
    </CenteredLayout>
  );
};

export default SwapPage;
