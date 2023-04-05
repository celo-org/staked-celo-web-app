import { useEffect, useMemo } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Row } from 'src/components/list/row';
import { Switcher } from 'src/components/switcher/Switcher';
import { useGovernance } from 'src/hooks/useGovernance';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { Mode } from 'src/types';

export const Governance = () => {
  const { loadDequeue, approval, referendum, error } = useGovernance();
  useEffect(() => {
    void loadDequeue();
  }, [loadDequeue]);

  const proposals = useMemo(
    () => [...(approval || []), ...(referendum || [])],
    [approval, referendum]
  );

  return (
    <CenteredLayout classes="px-[24px]">
      <Switcher mode={Mode.governance} />
      <form className="w-full flex justify-center items-center mt-[24px] bg-secondary p-[8px] rounded-[16px]">
        {proposals.length ? (
          <ul className="flex flex-col gap-4 w-full">
            {proposals.map((proposal) => (
              <Row
                key={proposal.proposalID.toString()}
                name={
                  proposal.parsedYAML
                    ? proposal.parsedYAML.title
                    : `Proposal #${proposal.proposalID.toString()}`
                }
                href={`/governance/${proposal.proposalID.toString()}`}
              />
            ))}
          </ul>
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
    </CenteredLayout>
  );
};
