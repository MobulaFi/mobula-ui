"use client";
import React, { createContext, useMemo, useState } from "react";
import { IOverviewContext } from "../models";

interface OverviewProviderProps {
  children: React.ReactNode;
  recentlyAdded: any;
  daoMembers: any;
  validated: any;
  rejected: any;
}

export const OverviewContext = createContext({} as IOverviewContext);

export const OverviewProvider = ({
  children,
  recentlyAdded,
  daoMembers,
  validated,
  rejected,
}: OverviewProviderProps) => {
  const [tokensOwed, setTokensOwed] = useState(0);
  const [goodDecisions, setGoodDecisions] = useState(0);
  const [badDecisions, setBadDecisions] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [claimed, setClaimed] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const memoizedValue = useMemo(
    () => ({
      bufferRecentlyAdded: recentlyAdded,
      bufferDaoMembers: daoMembers,
      bufferValidated: validated,
      bufferRejected: rejected,
      tokensOwed,
      setTokensOwed,
      goodDecisions,
      setGoodDecisions,
      badDecisions,
      setBadDecisions,
      countdown,
      setCountdown,
      claimed,
      setClaimed,
      userRank,
      setUserRank,
    }),
    [
      recentlyAdded,
      daoMembers,
      validated,
      rejected,
      tokensOwed,
      setTokensOwed,
      goodDecisions,
      setGoodDecisions,
      badDecisions,
      setBadDecisions,
      countdown,
      setCountdown,
      claimed,
      setClaimed,
      userRank,
      setUserRank,
    ]
  );

  return (
    <OverviewContext.Provider value={memoizedValue}>
      {children}
    </OverviewContext.Provider>
  );
};
