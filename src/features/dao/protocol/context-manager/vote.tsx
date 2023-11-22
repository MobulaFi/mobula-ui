import React, {createContext, useRef, useState, useMemo} from "react";
import {IVoteContext} from "../models";

export const VoteContext = createContext({
  utilityScore: 0,
  socialScore: 0,
  trustScore: 0,
} as IVoteContext);

export const VoteProvider = ({children}: {children: React.ReactNode}) => {
  const [utilityScore, setUtilityScore] = useState(0);
  const [socialScore, setSocialScore] = useState(0);
  const [trustScore, setTrustScore] = useState(0);
  const complete = useRef(false);

  const value = useMemo(
    () => ({
      utilityScore,
      setUtilityScore,
      socialScore,
      setSocialScore,
      trustScore,
      setTrustScore,
      complete,
    }),
    [
      utilityScore,
      setUtilityScore,
      socialScore,
      setSocialScore,
      trustScore,
      setTrustScore,
      complete,
    ],
  );

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};
