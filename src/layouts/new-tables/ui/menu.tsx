import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { VscArrowSwap } from "react-icons/vsc";
import { Drawer } from "../../../components/drawer";
import { WatchlistContext } from "../../../contexts/pages/watchlist";
import { PopupStateContext, PopupUpdateContext } from "../../../contexts/popup";
import { SettingsMetricContext } from "../../../contexts/settings";
import { UserContext } from "../../../contexts/user";
import { IWatchlist } from "../../../interfaces/pages/watchlist";
import { useWatchlist } from "../hooks/watchlist";
import { WatchlistAdd } from "./watchlist";

export const MenuCommun = () => {
  const { showMenuTableMobileForToken, showMenuTableMobile } =
    useContext(PopupStateContext);
  const { user } = useContext(UserContext);
  const pathname = usePathname();
  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
    setShowAlert,
  } = useContext(PopupUpdateContext);
  const { setShowBuyDrawer } = useContext(SettingsMetricContext);
  const watchlist = user?.main_watchlist as IWatchlist;
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { setTokenToAddInWatchlist, activeWatchlist, setActiveWatchlist } =
    useContext(WatchlistContext);
  const lineStyle =
    "p-[15px] cursor-pointer flex items-center font-medium border-b border-light-border-primary dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200 ease-in-out";
  const isDarkMode = resolvedTheme === "dark";
  const { inWatchlist, handleAddWatchlist } = useWatchlist(
    showMenuTableMobileForToken.id
  );
  const [addedToWatchlist, setAddedToWatchlist] = useState(inWatchlist);

  const addOrRemoveFromWatchlist = async () => {
    if (pathname.includes("watchlist")) {
      if (!activeWatchlist?.assets?.includes(showMenuTableMobileForToken?.id)) {
        setShowAddedToWatchlist(true);
        setTokenToAddInWatchlist(showMenuTableMobileForToken);
      } else {
        handleAddWatchlist(
          showMenuTableMobileForToken.id,
          Number(activeWatchlist?.id),
          false,
          setIsLoading
        );
        setActiveWatchlist((prev) => ({
          ...prev,
          assets: prev.assets.filter(
            (asset) => asset !== showMenuTableMobileForToken.id
          ),
        }));
      }
    } else if (!inWatchlist) {
      setShowAddedToWatchlist(true);
      setTokenToAddInWatchlist(showMenuTableMobileForToken);
    } else {
      setShowAddedToWatchlist(false);
      handleAddWatchlist(
        showMenuTableMobileForToken?.id,
        watchlist?.id,
        false,
        setIsLoading
      );
    }
  };

  return (
    <Drawer
      isOpen={showMenuTableMobile}
      position="bottom"
      onClose={() => {
        setShowMenuTableMobile(false);
        setShowMenuTableMobileForToken(null);
      }}
    >
      <div
        className={lineStyle}
        onClick={() => {
          addOrRemoveFromWatchlist();
          setShowMenuTableMobileForToken(null);
          setShowMenuTableMobile(false);
        }}
      >
        <div
          className="bg-light-bg-hover dark:bg-dark-bg-hover rounded-md mr-2.5 p-1 w-[30px] 
        h-[30px] items-center justify-center flex"
        >
          <WatchlistAdd
            addOrRemoveFromWatchlist={addOrRemoveFromWatchlist}
            setAddedToWatchlist={setAddedToWatchlist}
            addedToWatchlist={addedToWatchlist}
            token={showMenuTableMobileForToken}
            noRank
            showMobile
          />
        </div>
        {inWatchlist ? "Remove from " : "Add to "} Watchlist
      </div>
      {showMenuTableMobileForToken.contracts &&
        showMenuTableMobileForToken.contracts.length > 0 && (
          <div
            className={lineStyle}
            onClick={() => {
              setShowBuyDrawer(showMenuTableMobileForToken);
              setShowMenuTableMobileForToken(null);
              setShowMenuTableMobile(false);
            }}
          >
            <div
              className="bg-light-bg-hover dark:bg-dark-bg-hover rounded-md mr-2.5 p-1 w-[30px] 
            h-[30px] items-center justify-center flex"
            >
              <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100 text-sm" />
            </div>
            {`Buy  & Sell ${showMenuTableMobileForToken.symbol}`}
          </div>
        )}
      {/* <div
        className={lineStyle}
        onClick={() => {
          setShowAlert(showMenuTableMobileForToken?.name);
          pushData("Swap", {
            name: "Alert Asset",
            from_page: pathname,
            asset: showMenuTableMobileForToken?.name,
          });
          setShowMenuTableMobileForToken(null);
          setShowMenuTableMobile(false);
        }}
      >
        <div
          className="bg-light-bg-hover dark:bg-dark-bg-hover rounded-md mr-2.5 p-1 w-[30px]
         h-[30px] items-center justify-center flex"
        >
          <TbBellRinging className="text-light-font-100 dark:text-dark-font-100 text-lg" />
        </div>
        Set a Price Alert
      </div> */}
    </Drawer>
  );
};
