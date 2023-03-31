import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Swap } from 'src/features/swap/components/Swap';
import { Mode } from 'src/types';

const SwapPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug?: string[] };
  const mode = slug ? slug[0] : Mode.stake;

  const onModeChange = (mode: Mode) => {
    void router.push({
      pathname: `/${mode}`,
    });
  };
  if (typeof mode !== 'string' || !Object.values(Mode).includes(mode as Mode)) return null;
  return <Swap mode={mode as Mode} onModeChange={onModeChange} />;
};

export default SwapPage;
