"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface ChainsContextProps {
  pairs: PairsProps[];
  setPairs: React.Dispatch<React.SetStateAction<PairsProps[]>>;
  chain: ChainsProps;
  setChain: React.Dispatch<React.SetStateAction<ChainsProps>>;
}

const ChainsContext = createContext<ChainsContextProps>(
  {} as ChainsContextProps
);

export const useChains = () => useContext(ChainsContext);

interface ChainsProviderProps {
  children: ReactNode;
  pairs: PairsProps[];
  chain: ChainsProps;
}

export const ChainsProvider = ({
  children,
  chain: chainBuffer,
  pairs: pairsBuffer,
}: ChainsProviderProps) => {
  const [chain, setChain] = useState(chainBuffer);
  const [pairs, setPairs] = useState(pairsBuffer || []);
  const contextValue = React.useMemo(
    () => ({
      pairs,
      setPairs,
      chain,
      setChain,
    }),
    [chain, pairs]
  );

  return (
    <ChainsContext.Provider value={contextValue}>
      {children}
    </ChainsContext.Provider>
  );
};
