import { useAccountContext } from 'src/contexts/account/AccountContext'
import { ValidatorGroupRow } from 'src/features/validators/components/ValidatorGroupRow'
import { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups'

interface ValidatorsProps {
  list: ValidatorGroup[];
}

export const Validators = ({ list }: ValidatorsProps) => {
  const _ctx = useAccountContext();

  return (
    <ul className="flex flex-col justify-center w-full bg-secondary mt-[24px] p-2 rounded-[16px] gap-2">
      <ValidatorGroupRow
        name="Default Strategy"
        groupAddress="0x0000000000000000000000000000000000000000"
        isCurrentStrategy={true}
      />
      {list.map((vg) => (
        <ValidatorGroupRow key={vg.address} name={vg.name} groupAddress={vg.address} />
      ))}
    </ul>
  );
}
