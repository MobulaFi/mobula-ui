"use client";
import React, { useMemo, useState } from "react";
import { IShowMoreContext } from "../models";

interface ShowMoreProviderProps {
  children: React.ReactNode;
}

export const ShowMoreContext = React.createContext({} as IShowMoreContext);
export const ShowMoreProvider = ({ children }: ShowMoreProviderProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showContract, setShowContract] = useState<boolean>(false);
  const [showSocial, setShowSocial] = useState(false);

  const value = useMemo(
    () => ({
      showMore,
      setShowMore,
      showContract,
      setShowContract,
      showSocial,
      setShowSocial,
    }),
    [
      showMore,
      setShowMore,
      showContract,
      setShowContract,
      showSocial,
      setShowSocial,
    ]
  );

  return (
    <ShowMoreContext.Provider value={value}>
      {children}
    </ShowMoreContext.Provider>
  );
};
