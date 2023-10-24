import React from "react";
import WagmiProvider from "../lib/wagmi/provider";
import { WatchlistProvider } from "./pages/watchlist";
import { SettingsMetricProvider } from "./settings";
import { UserProvider } from "./user";

interface GeneralContextProps {
  children: React.ReactNode;
}

export const GeneralContext = ({ children }: GeneralContextProps) => {
  return (
    <WagmiProvider>
      <WatchlistProvider>
        <UserProvider>
          <SettingsMetricProvider>{children}</SettingsMetricProvider>
        </UserProvider>
      </WatchlistProvider>
    </WagmiProvider>
  );
};
