import BigNumber from 'bignumber.js';

export class Celo extends BigNumber {
  private __tokenType = 'Celo';
}

export class CeloWei extends BigNumber {
  private __tokenType = 'CeloWei';
}

export class StCelo extends BigNumber {
  private __tokenType = 'StCelo';
}

export class StCeloWei extends BigNumber {
  private __tokenType = 'StCeloWei';
}
