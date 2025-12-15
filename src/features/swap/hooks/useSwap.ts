import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { MAX_AMOUNT_THRESHOLD } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { TxCallbacks } from 'src/contexts/blockchain/useBlockchain';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { showErrorToast, WITHDRAWAL_AMOUNT_TOO_HIGH_ERROR } from 'src/features/swap/utils/toast';
import { Mode } from 'src/types';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { stakingRate, unstakingRate } = useProtocolContext();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoAmount, setCeloAmount, stake, receivedStCelo, estimateStakingGasInUSD } =
    useStaking();
  const { stCeloAmount, setStCeloAmount, unstake, receivedCelo, estimateUnstakingGasInUSD } =
    useUnstaking();

  let balance: Token;
  let amount: Token | null;
  let receiveAmount: Token | null;
  let swapRate: number;
  let estimateGasInUSD: () => Promise<CeloUSD | null>;
  let swap: (callbacks?: TxCallbacks) => void;
  let setAmount: (amount?: Token) => void;

  switch (mode) {
    case Mode.unstake:
      balance = stCeloBalance;
      amount = stCeloAmount;
      receiveAmount = receivedCelo;
      swapRate = unstakingRate;
      estimateGasInUSD = estimateUnstakingGasInUSD;
      swap = unstake;
      setAmount = (amount?: Token) => setStCeloAmount(!amount ? null : new StCelo(amount));
      break;
    default:
    case Mode.stake:
      balance = celoBalance;
      amount = celoAmount;
      receiveAmount = receivedStCelo;
      swapRate = stakingRate;
      estimateGasInUSD = estimateStakingGasInUSD;
      swap = stake;
      setAmount = (amount?: Token) => setCeloAmount(!amount ? null : new Celo(amount));
      break;
  }

  const setMaxAmount = useCallback(() => {
    let maxAmount: Token;
    if (Mode.stake) {
      // NOTE: we're doing this weird `minus` operation to make sure the
      // account owner has enough currency leftover to pay for gasfees.

      // NOTE2: this is a good use-case for alternative gas currencies
      // (cUSD, cEUR, etc...)
      maxAmount = new Token(BigNumber.max(0, balance.minus(MAX_AMOUNT_THRESHOLD.toString())));
    } else if (Mode.unstake) {
      maxAmount = new Token(BigNumber.max(0, balance));
    }
    setAmount(maxAmount!);
  }, [setAmount, balance]);

  // Don't override gasFee when estimateGas function is not the latest one
  const [gasFee, setGasFee] = useState<CeloUSD | null>(null);
  useEffect(() => {
    let aborted = false;
    void estimateGasInUSD()
      .then((estimatedGas) => !aborted && setGasFee(estimatedGas))
      .catch((error) => {
        if (error.message.includes('WithdrawalAmountTooHigh')) {
          showErrorToast(WITHDRAWAL_AMOUNT_TOO_HIGH_ERROR);
        }
      });
    return () => {
      aborted = true;
    };
  }, [estimateGasInUSD]);

  // When switching modes expected received amount should be set as provided amount
  // Because receiveAmount is updated after mode is changed we need to perform instance type check
  useEffect(() => {
    if (mode === Mode.stake && (!receiveAmount || receiveAmount instanceof StCelo)) {
      setStCeloAmount(receiveAmount);
    } else if (mode === Mode.unstake && (!receiveAmount || receiveAmount instanceof Celo)) {
      setCeloAmount(receiveAmount);
    }
  }, [mode, receiveAmount, setCeloAmount, setStCeloAmount]);

  return { amount, setAmount, setMaxAmount, balance, swap, receiveAmount, swapRate, gasFee };
}
