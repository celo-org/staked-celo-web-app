import { Row } from 'src/components/list/row';
import { Switcher } from 'src/components/switcher/Switcher';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

interface ValidatorsProps {
  onModeChange: (mode: Mode) => void;
}

export const Validators = ({ onModeChange }: ValidatorsProps) => {
  const _ctx = useAccountContext();

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={Mode.validators} onModeChange={onModeChange} />
      <form className="w-full justify-center items-center mt-[24px]">
        <div className="flex flex-col justify-center items-center w-full bg-secondary p-[8px] rounded-[16px] gap-4">
          <Row name="Validator Group #1" href="/validators/1" />
          <Row name="Validator Group #2" href="/validators/2" />
          <Row name="Validator Group #3" href="/validators/3" />
          <Row name="Validator Group #4" href="/validators/4" />
        </div>
      </form>
    </CenteredLayout>
  );
};
