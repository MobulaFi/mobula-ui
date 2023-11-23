"use client";
import React, { createContext, useMemo, useState } from "react";
import { IReasonVoteContext, IShowReasonContext } from "../models";

interface ShowReasonProviderProps {
  children: React.ReactNode;
}

export const ShowReasonContext = createContext({} as IShowReasonContext);

export const ShowReasonProvider = ({ children }: ShowReasonProviderProps) => {
  const [showUtility, setShowUtility] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const contextValue = useMemo(
    () => ({
      showUtility,
      setShowUtility,
      showSocial,
      setShowSocial,
      showTrust,
      setShowTrust,
      showReject,
      setShowReject,
    }),
    [
      showUtility,
      setShowUtility,
      showSocial,
      setShowSocial,
      showTrust,
      setShowTrust,
      showReject,
      setShowReject,
    ]
  );

  return (
    <ShowReasonContext.Provider value={contextValue}>
      {children}
    </ShowReasonContext.Provider>
  );
};

export const ReasonVoteContext = createContext({} as IReasonVoteContext);

export const ReasonVoteProvider = ({ children }) => {
  const [reasonUtility, setReasonUtility] = useState(0);
  const [reasonTrust, setReasonTrust] = useState(0);
  const [reasonSocial, setReasonSocial] = useState(0);
  const [reasonReject, setReasonReject] = useState(0);
  const value = useMemo(
    () => ({
      reasonUtility,
      setReasonUtility,
      reasonSocial,
      setReasonSocial,
      reasonTrust,
      setReasonTrust,
      reasonReject,
      setReasonReject,
    }),
    [
      reasonUtility,
      setReasonUtility,
      reasonSocial,
      setReasonSocial,
      reasonTrust,
      setReasonTrust,
      reasonReject,
      setReasonReject,
    ]
  );

  return (
    <ReasonVoteContext.Provider value={value}>
      {children}
    </ReasonVoteContext.Provider>
  );
};
