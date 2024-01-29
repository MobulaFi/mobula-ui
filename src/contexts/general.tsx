"use client";
import React, { useContext, useMemo, useState } from "react";

interface GeneralContextProps {
  editAssetReducer: any;
  setEditAssetReducer: React.Dispatch<any>;
}

export const GeneralContext = React.createContext({} as GeneralContextProps);

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralProvider = ({ children }) => {
  const [editAssetReducer, setEditAssetReducer] = useState<any>(null);

  const value = useMemo(
    () => ({
      editAssetReducer,
      setEditAssetReducer,
    }),
    [editAssetReducer, setEditAssetReducer]
  );

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  );
};
