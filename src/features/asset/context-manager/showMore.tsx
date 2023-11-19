"use client";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";

interface NavActiveProviderProps {
  children: React.ReactNode;
}

interface NavActiveContextProps {
  activeNav: string;
  setActiveNav: Dispatch<SetStateAction<string>>;
}

export const NavActiveContext = React.createContext(
  {} as NavActiveContextProps
);

export const NavActiveProvider = ({ children }: NavActiveProviderProps) => {
  const [activeNav, setActiveNav] = useState<string>("");

  const value = useMemo(
    () => ({ activeNav, setActiveNav }),
    [activeNav, setActiveNav]
  );

  return (
    <NavActiveContext.Provider value={value}>
      {children}
    </NavActiveContext.Provider>
  );
};
