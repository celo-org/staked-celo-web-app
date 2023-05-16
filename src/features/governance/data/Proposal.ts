import type { ProposalRecord } from '@celo/contractkit/lib/wrappers/Governance';
import BigNumber from 'bignumber.js';
import { ParsedYAML } from 'src/utils/proposals';

export type MiniProposal = {
  proposalID: bigint;
  stage: ProposalRecord['stage'];
  metadata: {
    descriptionURL: string;
    timestamp: BigNumber | string | number;
  };
};

export type Proposal = MiniProposal & {
  parsedYAML: ParsedYAML | null;
  approvals?: ProposalRecord['approvals'];
  votes?: ProposalRecord['votes'];
  passed: ProposalRecord['passed'];
};
