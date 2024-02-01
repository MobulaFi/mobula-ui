"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface ChainsContextProps {
  pairs: any[];
  setPairs: React.Dispatch<React.SetStateAction<any[]>>;
  chains: any[];
  setChains: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChainsContext = createContext<ChainsContextProps>(
  {} as ChainsContextProps
);

export const useChains = () => useContext(ChainsContext);

interface ChainsProviderProps {
  children: ReactNode;
}

export const ChainsProvider = ({ children }: ChainsProviderProps) => {
  const [chains, setChains] = useState([]);
  const [pairs, setPairs] = useState([]);
  const contextValue = React.useMemo(
    () => ({
      pairs,
      setPairs,
      chains,
      setChains,
    }),
    [chains, pairs]
  );

  return (
    <ChainsContext.Provider value={contextValue}>
      {children}
    </ChainsContext.Provider>
  );
};
