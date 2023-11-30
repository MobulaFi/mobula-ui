import React from "react";
import { AccountHeaderProvider } from "../layouts/header/context-manager";
import WagmiProvider from "../lib/wagmi/provider";
import { SearchbarProvider } from "../popup/searchbar/context-manager";
import { WatchlistProvider } from "./pages/watchlist";
import { PopupProvider } from "./popup";
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
          <SearchbarProvider>
            <AccountHeaderProvider>
              <PopupProvider>
                <SettingsMetricProvider>{children}</SettingsMetricProvider>
              </PopupProvider>
            </AccountHeaderProvider>
          </SearchbarProvider>
        </UserProvider>
      </WatchlistProvider>
    </WagmiProvider>
  );
};
