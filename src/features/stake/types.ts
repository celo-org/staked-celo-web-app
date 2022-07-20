export interface StakeFormValues {
  amount?: number;
}

export interface Cost {
  title: string;
  value: string | number;
  tooltip: {
    content: string;
  };
}

export type StakeToken = 'CELO' | 'stCELO';
