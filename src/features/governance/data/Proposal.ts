import { ProposalRecord } from '@celo/contractkit/lib/wrappers/Governance';
import { ParsedYAML } from 'src/utils/proposals';

export type Proposal = {
  proposalID: string;
  parsedYAML: ParsedYAML | null;
  stage: ProposalRecord['stage'];
  approvals?: ProposalRecord['approvals'];
  votes?: ProposalRecord['votes'];
  passed: ProposalRecord['passed'];
  metadata: {
    descriptionURL: string;
    timestamp: string;
  };
};
