"use client";
import React, { useContext, useMemo, useState } from "react";
import { EditState } from "../contexts/model";

interface GeneralContextProps {
  editAssetReducer: any;
  setEditAssetReducer: React.Dispatch<any>;
}

export const GeneralContext = React.createContext({} as GeneralContextProps);

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralProvider = ({ children }) => {
  const [editAssetReducer, setEditAssetReducer] = useState<EditState>({
    name: "",
    symbol: "",
    image: {
      loading: false,
      uploaded_logo: false,
      logo: "",
    },
    description: "",
    categories: [],
    completed: false,
    links: {
      website: "",
      twitter: "",
      telegram: "",
      discord: "",
      github: "",
      audits: [],
      kycs: [],
    },
    team: [],
    contracts: [
      {
        address: "",
        blockchain: "",
        blockchain_id: 1,
      },
    ],
  });

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
