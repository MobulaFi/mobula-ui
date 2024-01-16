"use client";
import { createContext, useMemo, useState } from "react";
import { IListingContext } from "../models";

export const ListingContext = createContext({} as IListingContext);

export const ListingProvider = ({ children }) => {
  const [isLaunched, setIsLaunched] = useState(true);
  const [actualPage, setActualPage] = useState(0);
  const [wallet, setWallet] = useState("");
  const [isListed, setIsListed] = useState(false);
  const memoizedValue = useMemo(
    () => ({
      isListed,
      setIsListed,
      wallet,
      setWallet,
      isLaunched,
      setIsLaunched,
      actualPage,
      setActualPage,
    }),
    [
      isListed,
      setIsListed,
      wallet,
      setWallet,
      isLaunched,
      setIsLaunched,
      actualPage,
      setActualPage,
    ]
  );

  return (
    <ListingContext.Provider value={memoizedValue}>
      {children}
    </ListingContext.Provider>
  );
};
