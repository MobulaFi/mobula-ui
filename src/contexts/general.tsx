"use client";
import React, { useContext, useMemo, useState } from "react";

interface GeneralContextProps {
  editAssetReducer: any;
  setEditAssetReducer: React.Dispatch<any>;
  baseEditAssetReducer: any;
  setBaseEditAssetReducer: React.Dispatch<any>;
  hideNav: string;
  setHideNav: React.Dispatch<React.SetStateAction<string>>;
}

export const GeneralContext = React.createContext({} as GeneralContextProps);

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralProvider = ({ children }) => {
  const [editAssetReducer, setEditAssetReducer] = useState<any>(null);
  const [baseEditAssetReducer, setBaseEditAssetReducer] = useState<any>(null);
  const [hideNav, setHideNav] = useState<string>("hidden");

  const value = useMemo(
    () => ({
      editAssetReducer,
      setEditAssetReducer,
      baseEditAssetReducer,
      setBaseEditAssetReducer,
      setHideNav,
      hideNav,
    }),
    [editAssetReducer, hideNav]
  );

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  );
};
