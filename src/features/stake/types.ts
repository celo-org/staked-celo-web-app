export interface StakeFormValues {
  amount?: number;
}

export interface Fee {
  title: string;
  value: string | number;
  tooltip: {
    content: string;
  };
}

export type StakeToken = 'CELO' | 'stCELO';
