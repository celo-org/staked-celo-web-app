import { useMemo } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { ValidatorGroupRow } from 'src/features/validators/components/ValidatorGroupRow';
import { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups';

interface ValidatorsProps {
  list: ValidatorGroup[];
}

const defaultStrategy: ValidatorGroup = {
  name: 'Default Strategy',
  address: '0x0000000000000000000000000000000000000000',
};

export const Validators = ({ list }: ValidatorsProps) => {
  const { strategy } = useAccountContext();

  const fullList = useMemo(() => {
    return [
      defaultStrategy,
      ...list.sort((a, b) => {
        return a.address === strategy ? -1 : b.address === strategy ? -1 : 0;
      }),
    ];
  }, [list, strategy]);

  return (
    <ul className="flex flex-col justify-center w-full bg-secondary mt-2 p-2 rounded-[16px] gap-2">
      {fullList.map((vg) => (
        <ValidatorGroupRow
          key={vg.address}
          name={vg.name}
          groupAddress={vg.address}
          isCurrentStrategy={vg.address === strategy}
        />
      ))}
    </ul>
  );
};
