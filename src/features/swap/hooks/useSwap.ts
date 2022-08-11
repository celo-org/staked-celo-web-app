import { useEffect, useState } from 'react';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';
import { useBlockchain } from 'src/hooks/useBlockchain';
import { Celo, CeloUSD, StCelo, Token } from 'src/utils/tokens';
import { Mode } from '../types';
import { useStaking } from './useStaking';
import { useUnstaking } from './useUnstaking';

export function useSwap(mode: Mode) {
  const { celoExchangeRate, stCeloExchangeRate } = useProtocolContext();
  const { celoBalance, stCeloBalance } = useAccountContext();
  const { celoAmount, setCeloAmount, stake, receivedStCelo, stakingGasFee } = useStaking();
  const { stCeloAmount, setStCeloAmount, unstake, receivedCelo, unstakingGasFee } = useUnstaking();
  const { cUSDExchangeContract } = useBlockchain();

  let exchangeRate: number;
  let gasFee: Celo;
  let balance: Token;
  let swap: () => void;
  let receiveAmount: Token;
  let amount: Token | null;
  let setAmount: () => void;

  switch (mode) {
    case 'stake':
      exchangeRate = celoExchangeRate;
      gasFee = stakingGasFee;
      balance = celoBalance;
      swap = stake;
      receiveAmount = receivedStCelo;
      amount = celoAmount;
      setAmount = (amount?: Token) => setCeloAmount(!amount ? null : new Celo(amount));
      break;
    case 'unstake':
      exchangeRate = stCeloExchangeRate;
      gasFee = unstakingGasFee;
      balance = stCeloBalance;
      swap = unstake;
      receiveAmount = receivedCelo;
      amount = stCeloAmount;
      setAmount = (amount?: Token) => setStCeloAmount(!amount ? null : new StCelo(amount));
      break;
  }

  // When switching modes expected received amount should be set as provided amount
  // Because receiveAmount is updated after mode is changed we need to perform instance type check
  useEffect(() => {
    if (receiveAmount.isEqualTo(0)) return;
    if (mode === 'stake' && receiveAmount instanceof StCelo) {
      setStCeloAmount(receiveAmount);
    } else if (mode === 'unstake' && receiveAmount instanceof Celo) {
      setCeloAmount(receiveAmount);
    }
  }, [mode, receiveAmount, setCeloAmount, setStCeloAmount]);

  const [gasFeeInUSD, setGasFeeInUSD] = useState<CeloUSD>(new CeloUSD(0));
  useEffect(() => {
    if (!cUSDExchangeContract || gasFee.isEqualTo(0)) return;
    void cUSDExchangeContract
      .quoteGoldSell(gasFee.toFixed())
      .then((cUSDValue) => setGasFeeInUSD(new CeloUSD(cUSDValue)));
  }, [cUSDExchangeContract, gasFee]);

  return { amount, setAmount, balance, swap, receiveAmount, exchangeRate, gasFeeInUSD };
}
