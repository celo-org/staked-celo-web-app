import { newKit } from '@celo/contractkit';
import {
  GovernanceWrapper,
  ProposalRecord,
  ProposalStage,
} from '@celo/contractkit/lib/wrappers/Governance';
import { useCelo } from '@celo/react-celo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRawGithubUrl, ParsedYAML, parsedYAMLFromMarkdown } from 'src/utils/proposals';

export type Proposal = ProposalRecord & {
  proposalID: string;
  markdown: string;
  parsedYAML: ParsedYAML | null;
};

export function useCeloGovernance() {
  const { network } = useCelo();
  const contractKit = useMemo(() => newKit(network.rpcUrl), [network]);
  const [governance, setGovernance] = useState<GovernanceWrapper>();

  const [queue, setQueue] = useState<null | Proposal[]>(null);
  const [approval, setApproval] = useState<null | Proposal[]>(null);
  const [referendum, setReferendum] = useState<null | Proposal[]>(null);
  const [execution, setExecution] = useState<null | Proposal[]>(null);
  const [expiration, setExpiration] = useState<null | Proposal[]>(null);
  const allProposals = useMemo(
    () =>
      (
        [queue, execution, expiration, approval, referendum].flat().filter(Boolean) as Proposal[]
      ).sort((a, b) => b.metadata.timestamp.minus(a.metadata.timestamp).toNumber()),
    [queue, execution, expiration, approval, referendum]
  );
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => void contractKit.contracts.getGovernance().then(setGovernance), [contractKit]);

  const getProposalRecord = useCallback(
    async (proposalID: string): Promise<Proposal | null> => {
      if (!governance) return null;

      const proposal = await governance.getProposalRecord(proposalID);
      const md = await fetch(getRawGithubUrl(proposal))
        .then((x) => x.text())
        .catch(() => "Failed to fetch proposals' markdown");

      return {
        proposalID,
        markdown: md,
        parsedYAML: parsedYAMLFromMarkdown(md),
        ...proposal,
      };
    },
    [governance]
  );

  const loadQueue = useCallback(async () => {
    if (!governance) return;
    try {
      const _queue = await governance.getQueue();
      setQueue(
        await Promise.all(
          _queue.map(async ({ proposalID }): Promise<Proposal> => {
            return getProposalRecord(proposalID.toString()) as Promise<Proposal>;
          })
        )
      );
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        console.error(e);
        setError(new Error('Error getting queue proposals'));
      }
    }
  }, [getProposalRecord, governance]);

  const loadDequeue = useCallback(async () => {
    if (!governance) return;
    try {
      const _dequeue = await governance.getDequeue();
      const proposalsByStage: Record<ProposalStage, Proposal[]> = {
        [ProposalStage.None]: [],
        [ProposalStage.Queued]: [],
        [ProposalStage.Approval]: [],
        [ProposalStage.Referendum]: [],
        [ProposalStage.Execution]: [],
        [ProposalStage.Expiration]: [],
      };
      const proposals = await Promise.all(
        _dequeue.map(async (bn) => {
          const proposalID = bn.toString();
          if (proposalID === '0') return null;
          return getProposalRecord(proposalID);
        })
      );

      proposals.filter(Boolean).forEach((proposal) => {
        proposalsByStage[proposal!.stage].push(proposal!);
      });

      setApproval(proposalsByStage[ProposalStage.Approval]);
      setReferendum(proposalsByStage[ProposalStage.Referendum]);
      setExecution(proposalsByStage[ProposalStage.Execution]);
      setExpiration(proposalsByStage[ProposalStage.Expiration]);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        console.error(e);
        setError(new Error('Error getting dequeue proposals'));
      }
    }
  }, [getProposalRecord, governance]);

  const loadSpecificProposal = useCallback(
    async (id: string) => {
      if (allProposals.find((x) => x.proposalID.toString() === id)) return;
      try {
        const proposal = await getProposalRecord(id);
        switch (proposal?.stage) {
          case ProposalStage.Queued:
            setQueue((x) => (x || []).concat(proposal));
            break;
          case ProposalStage.Approval:
            setApproval((x) => (x || []).concat(proposal));
            break;
          case ProposalStage.Referendum:
            setReferendum((x) => (x || []).concat(proposal));
            break;
          case ProposalStage.Execution:
            setExecution((x) => (x || []).concat(proposal));
            break;
          case ProposalStage.Expiration:
            setExpiration((x) => (x || []).concat(proposal));
            break;
          case ProposalStage.None:
          default:
            break;
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        } else {
          console.error(e);
          setError(new Error('Error getting proposal with id ' + id));
        }
      }
    },
    [allProposals, getProposalRecord]
  );

  return {
    governance,
    getProposalRecord,
    loadSpecificProposal,
    loadDequeue,
    loadQueue,
    allProposals,
    queue,
    approval,
    referendum,
    execution,
    expiration,
    error,
  };
}
