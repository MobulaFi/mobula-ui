"use client";
import React, { useMemo, useState } from "react";
import { ISettingMetric } from "../features/data/top100/models";
import { Asset } from "../interfaces/assets";
import { Coin } from "../interfaces/swap";

export const SettingsMetricContext = React.createContext({} as ISettingMetric);

export const SettingsMetricProvider = ({ children }) => {
  const [metrics, setMetrics] = useState<string[]>([]);
  const [type, setType] = useState<string>("Custom");
  const [sortBy, setSortBy] = useState("Current Page");
  const [showBuyDrawer, setShowBuyDrawer] = useState<Asset | Coin | null>(null);
  const value = useMemo(
    () => ({
      metrics,
      setMetrics,
      type,
      setType,
      setSortBy,
      sortBy,
      showBuyDrawer,
      setShowBuyDrawer,
    }),
    [
      metrics,
      setMetrics,
      type,
      setType,
      setSortBy,
      sortBy,
      showBuyDrawer,
      setShowBuyDrawer,
    ]
  );

  return (
    <SettingsMetricContext.Provider value={value}>
      {children}
    </SettingsMetricContext.Provider>
  );
};
