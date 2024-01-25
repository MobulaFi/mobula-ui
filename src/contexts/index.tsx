"use client";
import React from "react";
// import { positions, transitions } from "react-alert";
import { AccountHeaderProvider } from "../layouts/header/context-manager";
import WagmiProvider from "../lib/wagmi/provider";
import { SearchbarProvider } from "../popup/searchbar/context-manager";
import { GeneralProvider as CommunProvider } from "./general";
import { WatchlistProvider } from "./pages/watchlist";
import { PopupProvider } from "./popup";
import { SettingsMetricProvider } from "./settings";
import { UserProvider } from "./user";
interface GeneralContextProps {
  children: React.ReactNode;
}

export const GeneralContext = ({ children }: GeneralContextProps) => {
  // const options = {
  //   position: positions.TOP_RIGHT,
  //   timeout: 5000,
  //   transition: transitions.SCALE,
  // };
  return (
    <WagmiProvider>
      <WatchlistProvider>
        <UserProvider>
          <SearchbarProvider>
            <AccountHeaderProvider>
              <PopupProvider>
                <CommunProvider>
                  <SettingsMetricProvider>{children}</SettingsMetricProvider>{" "}
                </CommunProvider>
              </PopupProvider>
            </AccountHeaderProvider>
          </SearchbarProvider>
        </UserProvider>
      </WatchlistProvider>
    </WagmiProvider>
  );
};
