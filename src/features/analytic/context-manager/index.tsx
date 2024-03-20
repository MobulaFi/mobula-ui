"use client";
import React, { createContext, useContext, useState } from "react";
import { initialOptions } from "../constants";
import { AnalyticsContextProps } from "../models";

const AnalyticsContext = createContext<AnalyticsContextProps>(
  {} as AnalyticsContextProps
);

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState(initialOptions);
  const [views, setViews] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const contextValue = React.useMemo(
    () => ({
      selectedOption,
      setSelectedOption,
      views,
      setViews,
      setIsOpen,
      isOpen,
    }),
    [selectedOption, views, isOpen]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
