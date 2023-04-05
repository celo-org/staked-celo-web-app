import { RadioButton } from 'src/components/buttons/RadioButton';
import { VoteType } from 'src/types';

export type ChoiceProps = {
  voteType: VoteType | undefined;
  disabled?: boolean;
  onChange: (voteType: VoteType) => void;
};

export const Choices = ({ voteType, disabled, onChange }: ChoiceProps) => {
  return (
    <div className="flex flex-col bg-primary p-[8px] rounded-[16px] gap-4 w-full">
      <span className="font-medium text-[14px] text-color-secondary">vote</span>
      <div className="flex flex-row justify-evenly">
        {Object.values(VoteType)
          .filter((x) => x !== VoteType.upvote)
          .map((value) => (
            <RadioButton
              key={value}
              disabled={!!disabled}
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
