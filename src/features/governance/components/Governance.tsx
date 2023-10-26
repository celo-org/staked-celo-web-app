import { Row } from 'src/components/list/row';
import CurrentVotingBalanceDetails from 'src/features/governance/components/CurrentVotingBalanceDetails';
import { StagePill } from 'src/features/governance/components/StagePill';
import { SerializedProposal } from 'src/features/governance/data/getProposals';
import { useVote } from 'src/features/governance/hooks/useVote';

interface Props {
  proposals: SerializedProposal[];
  pastProposals: SerializedProposal[];
}

export const Governance = ({ proposals }: Props) => {
  const { lockedVoteBalance, lockedStCeloInVoting, unlockVoteBalance } = useVote();

  return (
    <div>
      <form className="w-full flex flex-col justify-center items-center mt-[24px] bg-secondary p-[8px] pb-4 rounded-[16px] gap-16 min-h-[368px]">
        <>
          <ul className="flex flex-col gap-4 w-full">
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <Row
                  key={proposal.proposalID.toString()}
                  name={
                    proposal.parsedYAML
                      ? `CGP-${proposal.parsedYAML.cgp} (#${proposal.proposalID}) ${proposal.parsedYAML.title}`
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
        </>
      </form>
      <CurrentVotingBalanceDetails
        lockedVoteBalance={lockedVoteBalance}
        lockedStCeloInVoting={lockedStCeloInVoting}
        unlockVoteBalance={unlockVoteBalance}
      />
    </div>
  );
};
