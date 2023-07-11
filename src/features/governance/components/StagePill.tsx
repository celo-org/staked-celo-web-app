import { Pill } from 'src/components/pills/Pill';
import { ProposalStage } from 'src/features/governance/components/Details';

type StagePillProps = {
  stage: ProposalStage;
};
export const StagePill = ({ stage }: StagePillProps) => {
  return <Pill classes={stageToBgClass(stage)}>{stageToText(stage)}</Pill>;
};

function stageToText(stage: ProposalStage) {
  switch (stage) {
    case ProposalStage.Approval:
      return 'approving';
    case ProposalStage.Execution:
      return 'passed';
    case ProposalStage.Expiration:
      return 'rejected';
    case ProposalStage.Queued:
      return 'queued';
    case ProposalStage.Referendum:
      return 'voting';
    case ProposalStage.None:
      return '';
  }
}

function stageToBgClass(stage: ProposalStage) {
  switch (stage) {
    case ProposalStage.Queued:
    case ProposalStage.Approval:
      return 'bg-secondary';
    case ProposalStage.Execution:
    case ProposalStage.Expiration:
      return 'bg-secondary-oposite text-color-contrast';
    case ProposalStage.Referendum:
      return 'bg-action-secondary-callout text-color-contrast';
    case ProposalStage.None:
      return 'bg-secondary';
  }
}
