"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface ChainsContextProps {
  pairs: any[];
  setPairs: React.Dispatch<React.SetStateAction<any[]>>;
  chain: any[];
  setChain: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChainsContext = createContext<ChainsContextProps>(
  {} as ChainsContextProps
);

export const useChains = () => useContext(ChainsContext);

interface ChainsProviderProps {
  children: ReactNode;
  pairs: any;
  chain: any;
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
