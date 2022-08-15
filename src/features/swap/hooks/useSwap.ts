import { useCallback, useEffect, useState } from 'react';
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
  const { celoAmount, setCeloAmount, stake, receivedStCelo, estimateStakingGas } = useStaking();
  const { stCeloAmount, setStCeloAmount, unstake, receivedCelo, estimateUnstakingGas } =
    useUnstaking();

  let balance: Token;
  let amount: Token | null;
  let receiveAmount: Token | null;
  let swapRate: number;
  let estimateGas: () => Promise<CeloUSD | null>;
  let swap: (callbacks?: TxCallbacks) => void;
  let setAmount: (amount?: Token) => void;

  switch (mode) {
    case 'stake':
      balance = celoBalance;
      amount = celoAmount;
      receiveAmount = receivedStCelo;
      swapRate = stakingRate;
      estimateGas = estimateStakingGas;
      swap = stake;
      setAmount = (amount?: Token) => setCeloAmount(!amount ? null : new Celo(amount));
      break;
    case 'unstake':
      balance = stCeloBalance;
      amount = stCeloAmount;
      receiveAmount = receivedCelo;
      swapRate = unstakingRate;
      estimateGas = estimateUnstakingGas;
      swap = unstake;
      setAmount = (amount?: Token) => setStCeloAmount(!amount ? null : new StCelo(amount));
      break;
  }

  const setMaxAmount = useCallback(() => {
    const maxAmount = new Token(balance.minus(MAX_AMOUNT_THRESHOLD));
    setAmount(maxAmount);
  }, [setAmount, balance]);

  // Don't override gasFee when estimateGas function is not the latest one
  const [gasFee, setGasFee] = useState<CeloUSD | null>(null);
  useEffect(() => {
    let aborted = false;
    void estimateGas().then((estimatedGas) => !aborted && setGasFee(estimatedGas));
    return () => {
      aborted = true;
    };
  }, [estimateGas]);

  // When switching modes expected received amount should be set as provided amount
  // Because receiveAmount is updated after mode is changed we need to perform instance type check
  useEffect(() => {
    if (mode === 'stake' && (!receiveAmount || receiveAmount instanceof StCelo)) {
      setStCeloAmount(receiveAmount);
    } else if (mode === 'unstake' && (!receiveAmount || receiveAmount instanceof Celo)) {
      setCeloAmount(receiveAmount);
    }
  }, [mode, receiveAmount, setCeloAmount, setStCeloAmount]);

  return { amount, setAmount, setMaxAmount, balance, swap, receiveAmount, swapRate, gasFee };
}
