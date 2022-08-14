import { useCallback, useEffect } from 'react';
import { MAX_AMOUNT_THRESHOLD } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { TxCallbacks } from 'src/hooks/useBlockchain';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { stakingRate, unstakingRate } = useProtocolContext();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoAmount, setCeloAmount, stake, receivedStCelo, stakingGasFee } = useStaking();
  const { stCeloAmount, setStCeloAmount, unstake, receivedCelo, unstakingGasFee } = useUnstaking();

  let swapRate: number;
  let gasFee: CeloUSD;
  let balance: Token;
  let swap: (callbacks?: TxCallbacks) => void;
  let receiveAmount: Token | null;
  let amount: Token | null;
  let setAmount: (amount?: Token) => void;

  switch (mode) {
    case 'stake':
      swapRate = stakingRate;
      gasFee = stakingGasFee;
      balance = celoBalance;
      swap = stake;
      receiveAmount = receivedStCelo;
      amount = celoAmount;
      setAmount = (amount?: Token) => setCeloAmount(!amount ? null : new Celo(amount));
      break;
    case 'unstake':
      swapRate = unstakingRate;
      gasFee = unstakingGasFee;
      balance = stCeloBalance;
      swap = unstake;
      receiveAmount = receivedCelo;
      amount = stCeloAmount;
      setAmount = (amount?: Token) => setStCeloAmount(!amount ? null : new StCelo(amount));
      break;
  }

  const swapMax = useCallback(() => {
    const maxAmount = new Token(balance.minus(MAX_AMOUNT_THRESHOLD));
    setAmount(maxAmount);
  }, [setAmount, balance]);

  // When switching modes expected received amount should be set as provided amount
  // Because receiveAmount is updated after mode is changed we need to perform instance type check
  useEffect(() => {
    if (mode === 'stake' && (!receiveAmount || receiveAmount instanceof StCelo)) {
      setStCeloAmount(receiveAmount);
    } else if (mode === 'unstake' && (!receiveAmount || receiveAmount instanceof Celo)) {
      setCeloAmount(receiveAmount);
    }
  }, [mode, receiveAmount, setCeloAmount, setStCeloAmount]);

  return { amount, setAmount, balance, swap, receiveAmount, swapRate, gasFee, swapMax };
}
