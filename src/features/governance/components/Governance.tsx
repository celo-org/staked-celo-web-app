import { Row } from 'src/components/list/row';
import { Switcher } from 'src/components/switcher/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

export const Governance = () => {
  // const _ctx = useAccountContext();

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={Mode.governance} />
      <form className="w-full justify-center items-center mt-[24px]">
        <ul className="flex flex-col justify-center w-full bg-secondary p-2 rounded-[16px] gap-2">
          <Row name="Proposal #1" href="/governance/1" />
          <Row name="Proposal #2" href="/governance/2" />
        </ul>
      </form>
    </CenteredLayout>
  );
};
