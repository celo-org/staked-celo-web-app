import { Row } from 'src/components/list/row';
import { StagePill } from 'src/features/governance/components/StagePill';
import { SerializedProposal } from 'src/features/governance/data/getProposals';

interface Props {
  proposals: SerializedProposal[];
  pastProposals: SerializedProposal[];
}

export const Governance = ({ proposals, pastProposals }: Props) => {
  return (
    <form className="w-full flex flex-col justify-center items-center mt-[24px] bg-secondary p-[8px] pb-4 rounded-[16px] gap-16 min-h-[368px]">
      <>
        <ul className="flex flex-col gap-4 w-full">
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <Row
                key={proposal.proposalID.toString()}
                name={
                  proposal.parsedYAML
                    ? proposal.parsedYAML.title
                    : `Proposal #${proposal.proposalID}`
                }
                href={`/governance/${proposal.proposalID}`}
              >
                <StagePill stage={proposal.stage} />
              </Row>
            ))
          ) : (
            <div className="flex flex-col bg-primary p-[8px] rounded-[16px] gap-4 w-full min-h-[70px] justify-center">
              <span className="text-color-primary pl-4">
                Currently no Proposals can be voted on.
              </span>
            </div>
          )}
        </ul>

        <div className="flex flex-col gap-4 w-full">
          <span className="text-color-primary pl-4">Past proposals</span>
          <ul className="flex flex-col gap-4 w-full">
            {pastProposals.map((proposal) => (
              <Row
                key={proposal.proposalID.toString()}
                name={
                  proposal.parsedYAML
                    ? proposal.parsedYAML.title
                    : `Proposal #${proposal.proposalID.toString()}`
                }
                nameClasses="text-color-secondary"
                href={`/governance/${proposal.proposalID.toString()}`}
              >
                <StagePill stage={proposal.stage} />
              </Row>
            ))}
          </ul>
        </div>
      </>
    </form>
  );
};
