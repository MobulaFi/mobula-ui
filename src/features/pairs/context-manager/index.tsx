"use client";
import React, { useMemo } from "react";
import { Trade } from "../../asset/models";

interface PairsContextProps {
  basePair: any;
  setBasePair: any;
  baseTrade: Trade[];
  setBaseTrade: any;
}

export const PairsContext = React.createContext({} as PairsContextProps);

interface BaseAssetProviderProps {
  pair: any;
  trade: Trade[];
  children: React.ReactNode;
}

export const PairsProvider = ({
  pair,
  trade,
  children,
}: BaseAssetProviderProps) => {
  const [basePair, setBasePair] = React.useState<any>(pair || {});
  const [baseTrade, setBaseTrade] = React.useState<Trade[]>(trade || []);

  const value = useMemo(() => {
    return {
      basePair,
      baseTrade,
      setBasePair,
      setBaseTrade,
    };
  }, [pair, trade, setBasePair, setBaseTrade]);

  return (
    <PairsContext.Provider value={value}>{children}</PairsContext.Provider>
  );
};
