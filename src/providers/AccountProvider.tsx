import BigNumber from 'bignumber.js';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';

interface IAccountContext {
  celoBalance: BigNumber;
  stakedCeloBalance: BigNumber;
  setCeloBalance: Dispatch<SetStateAction<BigNumber>>;
  setStakedCeloBalance: Dispatch<SetStateAction<BigNumber>>;
}

export const AccountContext = createContext<IAccountContext>({} as IAccountContext);

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const [celoBalance, setCeloBalance] = useState(new BigNumber(0));
  const [stakedCeloBalance, setStakedCeloBalance] = useState(new BigNumber(0));

  return (
    <AccountContext.Provider
      value={{
        celoBalance,
        setCeloBalance,
        stakedCeloBalance,
        setStakedCeloBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
