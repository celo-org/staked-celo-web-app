import { useRouter } from 'next/router';
import { CenteredLayout } from 'src/layout/CenteredLayout';

export const Details = () => {
  const router = useRouter();
  const {
    slug: [id],
  } = router.query as { slug: string[] };

  return (
    <CenteredLayout classes="px-[24px]">
      <div>Validator details for group #{id}</div>
    </CenteredLayout>
  );
};
