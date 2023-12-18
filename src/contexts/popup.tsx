"use client";
import { createContext, useEffect, useMemo, useState } from "react";
import { TableAsset } from "../interfaces/assets";
import { IPopupStateContext, IPopupUpdateContext } from "../interfaces/popup";
import { WalkthroughBuffer } from "../interfaces/transactions";
import { pushData } from "../lib/mixpanel";

export const PopupStateContext = createContext({} as IPopupStateContext);
export const PopupUpdateContext = createContext({} as IPopupUpdateContext);

export const PopupProvider = ({ children }) => {
  const [connect, setConnect] = useState(false);
  const [walkthroughBuffer, setWalkthroughBuffer] = useState<WalkthroughBuffer>(
    {} as WalkthroughBuffer
  );
  const [showAddedToWatchlist, setShowAddedToWatchlist] = useState(false);
  const [showCard, setShowCard] = useState<string>();
  const [showConnectSocialPopup, setShowConnectSocialPopup] =
    useState<string>();
  const [showSwitchNetwork, setShowSwitchNetwork] = useState<number | boolean>(
    false
  );
  const [showMenuTableMobile, setShowMenuTableMobile] = useState(false);
  const [showMenuTableMobileForToken, setShowMenuTableMobileForToken] =
    useState({} as TableAsset);
  const [showAlert, setShowAlert] = useState("");

  useEffect(() => {
    if (connect) pushData("Connect Popup Opened");
  }, [connect]);

  const stateValue = useMemo(
    () => ({
      connect,
      walkthroughBuffer,
      showCard,
      showAddedToWatchlist,
      showConnectSocialPopup,
      showSwitchNetwork,
      showMenuTableMobile,
      showMenuTableMobileForToken,
      showAlert,
    }),
    [
      connect,
      walkthroughBuffer,
      showCard,
      showAddedToWatchlist,
      showConnectSocialPopup,
      showSwitchNetwork,
      showMenuTableMobile,
      showMenuTableMobileForToken,
      showAlert,
    ]
  );

  const updateValue = useMemo(
    () => ({
      setConnect,
      setWalkthroughBuffer,
      setShowAddedToWatchlist,
      setShowCard,
      setShowSwitchNetwork,
      setShowMenuTableMobile,
      setShowConnectSocialPopup,
      setShowMenuTableMobileForToken,
      setShowAlert,
    }),
    [
      setConnect,
      setWalkthroughBuffer,
      setShowAddedToWatchlist,
      setShowCard,
      setShowSwitchNetwork,
      setShowConnectSocialPopup,
      setShowMenuTableMobile,
      setShowMenuTableMobileForToken,
      setShowAlert,
    ]
  );

  return (
    <PopupStateContext.Provider value={stateValue}>
      <PopupUpdateContext.Provider value={updateValue}>
        {children}
      </PopupUpdateContext.Provider>
    </PopupStateContext.Provider>
  );
};
