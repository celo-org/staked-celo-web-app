import { CenteredLayout } from 'src/layout/CenteredLayout';
interface Props {
  address: string;
  name?: string
}

export const Show = ({ address, name }: Props) => {
  return (
    <CenteredLayout classes="px-[24px]">
      <div>Details for {name} group #{address}</div>
    </CenteredLayout>
  );
};




