import BigNumber from 'bignumber.js';

export class Celo extends BigNumber {
  private __tokenType = 'Celo';
}

export class CeloWei extends BigNumber {
  private __tokenType = 'CeloWei';
}

export class StakedCelo extends BigNumber {
  private __tokenType = 'StakedCelo';
}

export class StCeloWei extends BigNumber {
  private __tokenType = 'StCeloWei';
}
