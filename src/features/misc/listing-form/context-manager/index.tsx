"use client";
import React, { createContext, useMemo, useState } from "react";
import { IListingContext } from "../models";

export const ListingContext = createContext({} as IListingContext);

export const ListingProvider = ({ children }) => {
  const [isLaunched, setIsLaunched] = useState(true);
  const [actualPage, setActualPage] = useState(0);
  const memoizedValue = useMemo(
    () => ({
      isLaunched,
      setIsLaunched,
      actualPage,
      setActualPage,
    }),
    [isLaunched, setIsLaunched, actualPage, setActualPage]
  );

  return (
    <ListingContext.Provider value={memoizedValue}>
      {children}
    </ListingContext.Provider>
  );
};
