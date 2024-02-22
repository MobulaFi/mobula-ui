"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { ChainsProps, PairsProps } from "../models";

interface ChainsContextProps {
  pairs: PairsProps[];
  setPairs: React.Dispatch<React.SetStateAction<PairsProps[]>>;
  chain: ChainsProps;
  setChain: React.Dispatch<React.SetStateAction<ChainsProps>>;
  switchedToNative: boolean;
  setSwitchedToNative?: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [switchedToNative, setSwitchedToNative] = useState(false);

  const contextValue = React.useMemo(
    () => ({
      pairs,
      setPairs,
      chain,
      setChain,
      switchedToNative,
      setSwitchedToNative,
    }),
    [chain, pairs, switchedToNative]
  );

  return (
    <ChainsContext.Provider value={contextValue}>
      {children}
    </ChainsContext.Provider>
  );
};
