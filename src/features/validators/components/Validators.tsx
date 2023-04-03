import { Switcher } from 'src/components/switcher/Switcher';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { ValidatorGroupRow } from 'src/features/validators/ValidatorGroupRow';
import { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups'
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

interface ValidatorsProps {
  onModeChange: (mode: Mode) => void;
  list: ValidatorGroup[]
}

export const Validators = ({ onModeChange, list }: ValidatorsProps) => {
  const _ctx = useAccountContext();

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={Mode.validators} onModeChange={onModeChange} />
      <ul className="flex flex-col justify-center w-full bg-secondary mt-2 p-2 rounded-[16px] gap-2">
        <ValidatorGroupRow
          name="Default Strategy"
          groupAddress="0x0000000000000000000000000000000000000000"
          isCurrentStrategy={true}
        />
        {list.map((vg) => (
          <ValidatorGroupRow key={vg.address} name={vg.name} groupAddress={vg.address} />
        ))}
      </ul>
    </CenteredLayout>
  );
};
