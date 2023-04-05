import { ProposalStage } from '@celo/contractkit/lib/wrappers/Governance';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Choices } from 'src/features/governance/components/Choices';
import { VoteButton } from 'src/features/governance/components/VoteButton';
import { useGovernance } from 'src/hooks/useGovernance';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import { VoteType } from 'src/types';

export const Details = () => {
  const router = useRouter();
  const {
    slug: [id],
  } = router.query as { slug: string[] };

  const { loadSpecificProposal, allProposals, error } = useGovernance();
  const [currentVote, setCurrentVote] = useState<VoteType>();

  // maybe that's less efficient but much easier to understand.
  // const [proposal, setProposal] = useState<Proposal>();
  // const [error, setError] = useState<Error>();

  // useEffect(() => {
  //   void getProposalRecord(id)
  //     .then((proposal) => setProposal(proposal!))
  //     .catch(setError);
  // }, [getProposalRecord, id]);

  const proposal = useMemo(
    () => allProposals.find((x) => x.proposalID.toString() === id),
    [id, allProposals]
  );

  const onVoteChange = useCallback((voteType: VoteType) => {
    setCurrentVote(voteType);
  }, []);

  useEffect(() => {
    if (!proposal) void loadSpecificProposal(id);
  }, [id, loadSpecificProposal, proposal]);

  const loaded = Boolean(proposal?.parsedYAML);

  return (
    <CenteredLayout classes="px-[24px]">
      <div className="w-full flex flex-col justify-center items-center mt-[24px] bg-secondary p-[8px] rounded-[16px] gap-4">
        <div className="flex justify-center bg-primary p-[8px] rounded-[16px] w-full">
          {loaded ? (
            <div className="flex flex-col justify-center gap-4">
              <div className="flex flex-row items-center bg-primary rounded-[16px] gap-2">
                <Link href="/governance">
                  <ThemedIcon
                    name="arrow"
                    alt="open"
                    classes="rotate-[90deg] cursor-pointer"
                    height={24}
                    width={24}
                  />
                </Link>
                <span className="font-medium text-[14px] text-color-secondary">
                  return to proposals
                </span>
              </div>
              <div className="text-[18px] text-color-primary">
                #{proposal!.parsedYAML!.cgp} {proposal!.parsedYAML!.title}
              </div>
              <a
                className="text-[16px] leading-[32px] text-color-callout-modal"
                href={proposal!.metadata.descriptionURL}
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex flex-row items-center bg-primary rounded-[16px] gap-2">
                  view info{' '}
                  <ThemedIcon
                    name="caret-purple"
                    alt="open"
                    classes="rotate-[270deg]"
                    width={16}
                    height={16}
                  />
                </div>
              </a>
            </div>
          ) : error ? (
            <div>Couldnt get proposal information from github: {error.message}</div>
          ) : (
            <ThemedIcon
              classes="animate-spin"
              name="spinner-contrast"
              alt="Spinner"
              width={40}
              height={40}
            />
          )}
        </div>
        {ProposalStage.Referendum === proposal?.stage && (
          <>
            <Choices disabled={!loaded || !!error} onChange={onVoteChange} voteType={currentVote} />
            {currentVote !== undefined && (
              <span className="text-[18px] text-color-tertiary-callout">
                XXX stCELO will vote {currentVote} for Proposal #{proposal.parsedYAML?.cgp}
              </span>
            )}
            <div className="w-full px-4 py-2">
              <VoteButton
                disabled={!loaded || !!error || currentVote === undefined}
                pending={false}
              />
            </div>
          </>
        )}
      </div>
    </CenteredLayout>
  );
};
