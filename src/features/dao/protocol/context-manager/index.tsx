"use client";
import React, { createContext, useMemo, useState } from "react";
import { ISortContext, TokenDivs } from "../models";

export const SortContext = createContext({} as ISortContext);

export const SortProvider = ({
  children,
  isFirstSort,
  isPendingPool,
}: {
  children: React.ReactNode;
  isFirstSort?: boolean;
  isPendingPool?: boolean;
}) => {
  const [tokenDivs, setTokenDivs] = useState<TokenDivs[]>([]);
  const [displayedToken, setDisplayedToken] = useState("");
  const [displayedPool, setDisplayedPool] = useState("");
  const [votes, setVotes] = useState<number[]>([]);
  const [tokenVotedID, setTokenVotedID] = useState(0);

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
    ]
  );

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};
