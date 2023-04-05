import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import { useEffect, useMemo } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Row } from 'src/components/list/row';
import { StagePill } from 'src/features/governance/components/StagePill';
import { useCeloGovernance } from 'src/hooks/useCeloGovernance';

const runningProposalStages = new Set([ProposalStage.Queued, ProposalStage.Referendum]);
const pastProposalStages = new Set([ProposalStage.Expiration, ProposalStage.Execution]);
export const Governance = () => {
  const { loadDequeue, allProposals, error } = useCeloGovernance();
  useEffect(() => {
    void loadDequeue();
  }, [loadDequeue]);

  const proposals = useMemo(
    () => allProposals.filter((x) => runningProposalStages.has(x.stage)),
    [allProposals]
  );
  const pastProposals = useMemo(
    () => allProposals.filter((x) => pastProposalStages.has(x.stage)).slice(0, 5),
    [allProposals]
  );

  const loaded = proposals.length > 0 || pastProposals.length > 0;

  return (
    <form className="w-full flex flex-col justify-center items-center mt-[24px] bg-secondary p-[8px] pb-4 rounded-[16px] gap-16 min-h-[368px]">
      {loaded ? (
        <>
          <ul className="flex flex-col gap-4 w-full">
            {proposals.length > 0 ? (
              proposals.map((proposal) => (
                <Row
                  key={proposal.proposalID.toString()}
                  name={
                    proposal.parsedYAML
                      ? proposal.parsedYAML.title
                      : `Proposal #${proposal.proposalID.toString()}`
                  }
                  href={`/governance/${proposal.proposalID.toString()}`}
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
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <ThemedIcon
          classes="animate-spin"
          name="spinner-contrast"
          alt="Spinner"
          width={40}
          height={40}
        />
      )}
    </form>
  );
};
