"use client";
import React, { createContext, useMemo, useState } from "react";
import { ISortContext, TokenDivs } from "../models";

interface SortProviderProps {
  children: React.ReactNode;
  isFirstSort?: boolean;
  isPendingPool?: boolean;
}

export const SortContext = createContext({} as ISortContext);

export const SortProvider = ({
  children,
  isFirstSort,
  isPendingPool,
}: SortProviderProps) => {
  const [tokenDivs, setTokenDivs] = useState<TokenDivs[]>([]);
  const [displayedToken, setDisplayedToken] = useState("");
  const [displayedPool, setDisplayedPool] = useState("");
  const [votes, setVotes] = useState<number[]>([]);
  const [tokenVotedID, setTokenVotedID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const value = useMemo(
    () => ({
      tokenDivs,
      setTokenDivs,
      setDisplayedToken,
      displayedToken,
      votes,
      setVotes,
      isFirstSort,
      setTokenVotedID,
      tokenVotedID,
      isPendingPool,
      setDisplayedPool,
      displayedPool,
      isLoading,
      setIsLoading,
    }),
    [
      tokenDivs,
      setTokenDivs,
      setDisplayedToken,
      displayedToken,
      votes,
      setVotes,
      isFirstSort,
      setTokenVotedID,
      tokenVotedID,
      isPendingPool,
      setDisplayedPool,
      displayedPool,
      isLoading,
      setIsLoading,
    ]
  );

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};
