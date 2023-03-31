import { Row } from 'src/components/list/row';
import { Switcher } from 'src/components/switcher/Switcher';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

interface GovernanceProps {
  onModeChange: (mode: Mode) => void;
}

export const Governance = ({ onModeChange }: GovernanceProps) => {
  // const _ctx = useAccountContext();

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={Mode.governance} onModeChange={onModeChange} />
      <form className="w-full justify-center items-center mt-[24px]">
        <div className="flex flex-col justify-center items-center w-full bg-secondary p-[8px] rounded-[16px] gap-4">
          <Row name="Proposal #1" href="/governance/1" />
          <Row name="Proposal #2" href="/governance/2" />
        </div>
      </form>
    </CenteredLayout>
  );
};
