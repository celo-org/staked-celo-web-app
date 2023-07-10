export enum Mode {
  stake = 'stake',
  unstake = 'unstake',
  governance = 'governance',
  validators = 'validators',
}

export enum VoteType {
  yes = 'yes',
  no = 'no',
  abstain = 'abstain',
}

export type Option<T> = T | undefined;
