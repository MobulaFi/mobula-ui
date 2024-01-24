"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { curatedDatasets } from "../constant";

export const HomeLandingContext = createContext({} as any);

export const useHomeLanding = () => useContext(HomeLandingContext);

export const HomeLandingProvider = ({ children }) => {
  const [activeDataset, setActiveDataset] = useState<any>(curatedDatasets[1]);
  const memoizedValue = useMemo(
    () => ({
      activeDataset,
      setActiveDataset,
    }),
    [activeDataset, setActiveDataset]
  );

  return (
    <HomeLandingContext.Provider value={memoizedValue}>
      {children}
    </HomeLandingContext.Provider>
  );
};
