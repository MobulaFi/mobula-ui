"use client";
import { Asset, TableAsset } from "interfaces/assets";
import { createContext, useMemo, useState } from "react";
import { IWatchlist, IWatchlistContext } from "../models";

export const WatchlistContext = createContext({} as IWatchlistContext);

export const WatchlistProvider = ({ children, watchlist }) => {
  const [activeWatchlist, setActiveWatchlist] = useState<IWatchlist | null>(
    null
  );

  const [showShare, setShowShare] = useState(false);
  const [pageSelected, setPageSelected] = useState("Watchlist");
  const [tokenToAddInWatchlist, setTokenToAddInWatchlist] =
    useState<TableAsset>({} as TableAsset);
  const [watchlists, setWatchlists] = useState<IWatchlist[]>([]);
  const [followedAndDiscoverWatchlist, setFollowedAndDiscoverWatchlist] =
    useState<IWatchlist[]>([]);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [isMainWatchlist, setIsMainWatchlist] = useState<boolean>(false);
  const [searchWatchlist, setSearchWatchlist] = useState("");
  const [showCreateWL, setShowCreateWL] = useState(false);
  const [tokens, setTokens] = useState<Asset[]>(watchlist || []);
  const [resultsData, setResultsData] = useState({
    data: watchlist || [],
    count: 0,
  });
  const [editName, setEditName] = useState({
    oldname: "",
    newname: "",
    watchlist: "",
  });
  const [isPageUserWatchlist, setIsPageUserWatchlist] =
    useState<boolean>(false);
  const [userOfWatchlist, setUserOfWatchlist] = useState(null);
  const [showAddCoins, setShowAddCoins] = useState<boolean>(false);
  const value = useMemo(
    () => ({
      activeWatchlist,
      searchWatchlist,
      setSearchWatchlist,
      setActiveWatchlist,
      pageSelected,
      setPageSelected,
      followedAndDiscoverWatchlist,
      setFollowedAndDiscoverWatchlist,
      tokenToAddInWatchlist,
      setTokenToAddInWatchlist,
      watchlists,
      setWatchlists,
      showEdit,
      setShowEdit,
      isMainWatchlist,
      setIsMainWatchlist,
      editName,
      setEditName,
      isPageUserWatchlist,
      setIsPageUserWatchlist,
      showShare,
      setShowShare,
      showAddCoins,
      setShowAddCoins,
      showCreateWL,
      setShowCreateWL,
      tokens,
      setTokens,
      userOfWatchlist,
      setUserOfWatchlist,
      resultsData,
      setResultsData,
    }),
    [
      activeWatchlist,
      searchWatchlist,
      setSearchWatchlist,
      setActiveWatchlist,
      pageSelected,
      setPageSelected,
      followedAndDiscoverWatchlist,
      setFollowedAndDiscoverWatchlist,
      tokenToAddInWatchlist,
      setTokenToAddInWatchlist,
      watchlists,
      setWatchlists,
      showEdit,
      setShowEdit,
      isMainWatchlist,
      setIsMainWatchlist,
      editName,
      setEditName,
      isPageUserWatchlist,
      setIsPageUserWatchlist,
      showShare,
      setShowShare,
      showAddCoins,
      setShowAddCoins,
      showCreateWL,
      setShowCreateWL,
      tokens,
      setTokens,
      userOfWatchlist,
      setUserOfWatchlist,
      resultsData,
      setResultsData,
    ]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
