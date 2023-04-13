import { ProposalRecord } from '@celo/contractkit/lib/wrappers/Governance';
import { ParsedYAML } from 'src/utils/proposals';

export type Proposal = ProposalRecord & {
  proposalID: string;
  markdown: string;
  parsedYAML: ParsedYAML | null;
};
