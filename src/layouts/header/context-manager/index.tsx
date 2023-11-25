"use client";
import React, { createContext, useMemo, useState } from "react";

interface IAccountHeader {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  showNotif: boolean;
  setShowNotif: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccountHeaderContext = createContext({} as IAccountHeader);

export const AccountHeaderProvider = ({ children }) => {
  const [selected, setSelected] = useState("Personal information");
  const [showNotif, setShowNotif] = useState(false);
  const value = useMemo(
    () => ({
      selected,
      setSelected,
      showNotif,
      setShowNotif,
    }),
    [selected, showNotif]
  );
  return (
    <AccountHeaderContext.Provider value={value}>
      {children}
    </AccountHeaderContext.Provider>
  );
};
