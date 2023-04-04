import { RadioButton } from 'src/components/buttons/RadioButton';

export enum VoteType {
  yes = 'yes',
  no = 'no',
  abstain = 'abstain',
}
export type VoteProps = {
  voteType: VoteType | undefined;
  onChange: (voteType: VoteType) => void;
};

export const Vote = ({ voteType, onChange }: VoteProps) => {
  return (
    <div className="flex flex-col bg-primary p-[8px] rounded-[16px] gap-4 w-full">
      <span className="font-medium text-[16px] text-color-secondary">vote</span>
      <div className="flex flex-row justify-evenly">
        {Object.values(VoteType).map((value) => (
          <RadioButton
            key={value}
            checked={voteType === value}
            onChange={() => onChange(value as VoteType)}
          >
            {<span className="capitalize">{value}</span>}
          </RadioButton>
        ))}
      </div>
    </div>
  );
};
